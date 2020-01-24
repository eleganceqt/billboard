<?php

class billboardAdvertModel extends billboardModel
{
    const STATUS_ON = 'on';
    const STATUS_OFF = 'off';

    protected $table = 'billboard_advert';

    public function setMainImage($advertId, $imageId)
    {
        return $this->updateById($advertId, ['image_id' => $imageId]);
    }

    public function setVisible($advertId)
    {
        return $this->updateById($advertId, ['status' => self::STATUS_ON]);
    }

    public function setHidden($advertId)
    {
        return $this->updateById($advertId, ['status' => self::STATUS_OFF]);
    }

    public function incrementViews($advertId)
    {
        $sqlString = "UPDATE {$this->table}
                      SET views = views + 1
                      WHERE id = :id";

        $sqlParams = ['id' => $advertId];

        return $this->exec($sqlString, $sqlParams);
    }

    public function getRouteEntity($id)
    {
        $record = $this->getByField(['id' => $id, 'status' => self::STATUS_ON]);

        if (billboardValidation::blank($record)) {
            throw new waException(null, 404);
        }

        return $record;
    }

    public function delete($id)
    {
        (new billboardAdvertImagesModel())->deleteByAdvertId($id);

        $this->deleteById($id);
    }

    public function findOrFail($id)
    {
        $record = $this->getById($id);

        if (billboardValidation::blank($record)) {
            $this->notFound();
        }

        return $record;
    }

    public static function isValidStatus($status)
    {
        return in_array($status, [self::STATUS_ON, self::STATUS_OFF]);
    }

    public function getByCategory($categoryId)
    {
        return $this->getByField('category_id', $categoryId, 'id');
    }

    public function getByPartner($partnerId)
    {
        return $this->getByField('partner_id', $partnerId, 'id');
    }

    public function showByCategory($categoryId)
    {
        $attributes = [
            'status' => self::STATUS_ON
        ];

        return $this->updateByField('category_id', $categoryId, $attributes);
    }

    public function hideByCategory($categoryId)
    {
        $attributes = [
            'status' => self::STATUS_OFF
        ];

        return $this->updateByField('category_id', $categoryId, $attributes);
    }

    public function deleteByCategory($categoryId)
    {
        $adverts = $this->getByCategory($categoryId);

        foreach ($adverts as $advert) {
            $this->delete($advert['id']);
        }
    }

    public function showByPartner($partnerId)
    {
        $attributes = [
            'status' => self::STATUS_ON
        ];

        return $this->updateByField('partner_id', $partnerId, $attributes);
    }

    public function hideByPartner($partnerId)
    {
        $attributes = [
            'status' => self::STATUS_OFF
        ];

        return $this->updateByField('partner_id', $partnerId, $attributes);
    }

    public function deleteByPartner($partnerId)
    {
        $adverts = $this->getByPartner($partnerId);

        foreach ($adverts as $advert) {
            $this->delete($advert['id']);
        }
    }

    public function countByPartner($partnerId)
    {
        $sqlString = "SELECT billboard_advert.partner_id, SUM(IF(billboard_advert.status = 'on', 1, 0)) AS active_count, COUNT(billboard_advert.id) AS total_count
                      FROM billboard_advert
                      WHERE billboard_advert.partner_id = i:partnerId
                      GROUP BY billboard_advert.partner_id";

        $sqlParams = [
            'partnerId' => $partnerId
        ];

        $record = $this->query($sqlString, $sqlParams)->fetchAssoc();

        if (billboardValidation::blank($record)) {
            $record = [
                'active_count' => 0,
                'total_count'  => 0
            ];
        }

        return $record;
    }

    public function countByPartners($keys)
    {
        if (billboardValidation::blank($keys)) {
            return [];
        }

        $sqlString = "SELECT billboard_advert.partner_id, SUM(IF(billboard_advert.status = 'on', 1, 0)) AS active_count, COUNT(billboard_advert.id) AS total_count
                      FROM billboard_advert
                      WHERE billboard_advert.partner_id IN (:keys)
                      GROUP BY billboard_advert.partner_id";

        $sqlParams = [
            'keys' => $keys
        ];

        return $this->query($sqlString, $sqlParams)->fetchAll('partner_id');
    }

    public function countByCities($keys)
    {
        if (billboardValidation::blank($keys)) {
            return [];
        }

        $sqlString = "SELECT billboard_advert.city_id, SUM(IF(billboard_advert.status = 'on', 1, 0)) AS active_count, COUNT(billboard_advert.id) AS total_count
                      FROM billboard_advert
                      WHERE billboard_advert.city_id IN (:keys)
                      GROUP BY billboard_advert.city_id";

        $sqlParams = [
            'keys' => $keys
        ];

        return $this->query($sqlString, $sqlParams)->fetchAll('city_id');
    }

}
