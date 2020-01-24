<?php

class billboardCityModel extends billboardModel
{
    const ID_NEW = 'new';

    protected $table = 'billboard_city';

    protected $perPage = 10;

    public function all()
    {
        return $this->select('*')
                    ->order('ranking DESC')
                    ->fetchAll('id');
    }

    public function slice($offset = 0, $limit = 10)
    {
        return $this->select('*')
                    ->order('name ASC')
                    ->limit($offset . ', ' . $limit)
                    ->fetchAll('id');
    }

    public function count()
    {
        return (int) $this->countAll();
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

    public function alreadyExists($name, $exceptId = 0)
    {
        $sqlString = "SELECT COUNT(*) FROM {$this->table()}
                      WHERE name = :name AND id != :id";

        $sqlParams = [
            'id'   => $exceptId,
            'name' => $name
        ];

        $duplicates = (int) $this->query($sqlString, $sqlParams)->fetchField();

        return $duplicates;
    }

    public static function mock()
    {
        return [
            'id'           => billboardCityModel::ID_NEW,
            'name'         => '',
            'country'      => 'rus',
            'active_count' => 0,
            'total_count'  => 0,
            'ranking'      => 0,
        ];
    }
}
