<?php

class billboardCategoryModel extends billboardNestedModel
{
    const ID_NEW = 'new';

    const STATUS_ON = 'on';
    const STATUS_OFF = 'off';

    protected $table = 'billboard_category';

    protected $left = 'left_key';
    protected $right = 'right_key';
    protected $depth = 'depth';
    protected $parent = 'parent_id';

    protected $perPage = 10;


    public function fullTree()
    {
        $sqlString = "SELECT billboard_category.*, SUM(IF(billboard_advert.status = 'on', 1, 0)) AS active_count, COUNT(billboard_advert.id) AS total_count
                      FROM billboard_category
                      LEFT JOIN billboard_advert ON billboard_category.id = billboard_advert.category_id
                      GROUP BY billboard_category.id
                      ORDER BY billboard_category.depth DESC, billboard_category.left_key";

        return $this->query($sqlString)->fetchAll('id');
    }

    public function fTree()
    {
        $categories = $this->fullTree();

        $this->childsPlaceholder($categories);

        foreach ($categories as &$category) {

            $parentId = $category['parent_id'];

            if (billboardValidation::positiveInt($parentId)) {

                $categoryId = $category['id'];

                $categories[$parentId]['childs'][$categoryId] = $category;

//                unset($categories[$categoryId]);

            }
        }

        $this->cleanChilds($categories);

        return $categories;
    }

    protected function childsPlaceholder(&$categories)
    {
        foreach ($categories as &$category) {
            $category['childs']       = [];
//            $category['active_count'] = 0;
//            $category['total_count']  = 0;
        }
    }

    protected function cleanChilds(&$categories)
    {
        foreach ($categories as &$category) {

            $parentId = $category['parent_id'];

            if (billboardValidation::positiveInt($parentId)) {

                $categoryId = $category['id'];

                unset($categories[$categoryId]);
            }
        }
    }

    public function getBrahnch($categoryId)
    {
        $super = $this->getById($categoryId);

        $descendants = $this->select('*')
                            ->where('left_key >= :left AND right_key <= :right', ['left' => $super['left_key'], 'right' => $super['right_key']])
                            ->fetchAll('id');


        return $descendants;
    }

    public function getRouteEntity($slug)
    {
        $record = $this->getByField(['slug' => $slug, 'status' => self::STATUS_ON]);

        if (billboardValidation::blank($record)) {
            throw new waException(null, 404);
        }

        return $record;
    }

    public function all()
    {
        $sqlString = "SELECT * 
                      FROM {$this->table}
                      WHERE status = :status
                      ORDER BY {$this->left}";

        $sqlParams = [
            'status' => self::STATUS_ON
        ];

        return $this->query($sqlString, $sqlParams)->fetchAll('id');
    }

    public function rootCategories()
    {
        return $this->select('*')
                    ->where('parent_id = 0 AND depth = 0 AND status = :status', ['status' => self::STATUS_ON])
                    ->order('left_key ASC')
                    ->fetchAll('id');
    }

    public function childCategories($categoryId)
    {
        $categories = $this->select('*')
                           ->where('parent_id = i:parentId AND status = :status', ['parentId' => $categoryId, 'status' => self::STATUS_ON])
                           ->order('left_key ASC')
                           ->fetchAll('id');

        if (billboardValidation::notBlank($categories)) {
            $this->fillAdvertsCount($categories);
        }

        return $categories;
    }

    public function fillAdvertsCount(&$categories)
    {
        $advertsCount = $this->advertsCount(array_keys($categories));

        foreach ($categories as &$category) {
            $category['adverts_count'] = ifempty($advertsCount[$category['id']], 0);
        }
    }

    public function advertsCount($keys)
    {
        $sqlString = "SELECT `ba`.`category_id`, COUNT(*) AS `count`
                      FROM `billboard_advert` AS `ba`
                      WHERE `ba`.`status` = :status AND `ba`.`category_id` IN (:keys)
                      GROUP BY `ba`.`category_id` ";

        $sqlParams = [
            'keys'   => $keys,
            'status' => self::STATUS_ON
        ];

        return $this->query($sqlString, $sqlParams)->fetchAll('category_id', 1);
    }

    public function findOrFail($id)
    {
        $record = $this->getById($id);

        if (billboardValidation::blank($record)) {
            $this->notFound();
        }

        // @todo WTF ??
        $record['active_count'] = 0;
        $record['total_count']  = 0;

        return $record;
    }

    public function isSlugTaken($slug, $exceptId = 0)
    {
        $sqlString = "SELECT COUNT(*) FROM {$this->table()}
                      WHERE slug = :slug AND id != :id";

        $sqlParams = [
            'id'   => $exceptId,
            'slug' => $slug
        ];

        $duplicates = (int) $this->query($sqlString, $sqlParams)->fetchField();

        return (bool) $duplicates;
    }

    public function search($query, $limit = 10)
    {
        if (trim($query) !== '') {
            return $this->select('*')
                        ->where('name LIKE :query', ['query' => '%' . $query . '%'])
                        ->order('left_key')
                        ->limit(10)
                        ->fetchAll('id');
        }

        return $this->select('*')->order('left_key')->limit(10)->fetchAll('id');
    }

    public function availableStatuses()
    {
        return [self::STATUS_ON, self::STATUS_OFF];
    }

    public function isValidStatus($status)
    {
        return in_array($status, $this->availableStatuses(), true);
    }

    public static function mock()
    {
        return [
            'id'               => billboardCategoryModel::ID_NEW,
            'left_key'         => null,
            'right_key'        => null,
            'depth'            => 0,
            'parent_id'        => null,
            'root_id'          => null,
            'name'             => '',
            'description'      => '',
            'slug'             => '',
            'title'            => '',
            'meta_keywords'    => '',
            'meta_description' => '',
            'status'           => '',
        ];
    }
}
