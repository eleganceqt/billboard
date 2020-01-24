<?php

class billboardPartnerFavoritesModel extends billboardModel
{
    protected $table = 'billboard_partner_favorites';

    public function getFavorites($partnerId)
    {
        $sqlString = "SELECT *
                      FROM {$this->table} AS `bpf`
                      INNER JOIN `billboard_advert` AS `ba` 
                          ON `ba`.`id` = `bpf`.`advert_id` AND `ba`.`status` = :status
                      WHERE `bpf`.`partner_id` = i:partnerId";

        $sqlParams = [
            'partnerId' => $partnerId,
            'status'    => billboardAdvertModel::STATUS_ON
        ];

        return array_keys($this->query($sqlString, $sqlParams)->fetchAll('advert_id'));
    }

    public function countFavorites($partnerId)
    {
        $sqlString = "SELECT COUNT(*)
                      FROM {$this->table} AS `bpf`
                      INNER JOIN `billboard_advert` AS `ba` 
                          ON `ba`.`id` = `bpf`.`advert_id` AND `ba`.`status` = :status
                      WHERE `bpf`.`partner_id` = i:partnerId";

        $sqlParams = [
            'partnerId' => $partnerId,
            'status'    => billboardAdvertModel::STATUS_ON
        ];

        return (int) $records = $this->query($sqlString, $sqlParams)->fetchField();
    }

    public function notInFavorites($partnerId, $advertId)
    {
        $count = (int) $this->countByField(['partner_id' => $partnerId, 'advert_id' => $advertId]);

        return $count === 0;
    }

    public function add($partnerId, $advertId)
    {
        return $this->insert(['partner_id' => $partnerId, 'advert_id' => $advertId]);
    }

    public function remove($partnerId, $advertId)
    {
        return $this->deleteByField(['partner_id' => $partnerId, 'advert_id' => $advertId]);
    }
}
