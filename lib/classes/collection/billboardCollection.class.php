<?php

abstract class billboardCollection
{
    /**
     * @var billboardModel
     */
    protected $model;

    /**
     * @var billboardQueryBuilder
     */
    protected $builder;

    /**
     * @var array
     */
    protected $relations = [];

    /**
     * Class constructor.
     */
    public function __construct()
    {
        $this->model = $this->newModel();

        $this->builder = $this->newBuilder();
    }

    /**
     * @return billboardModel
     */
    public function model()
    {
        return $this->model;
    }

    /**
     * @return billboardQueryBuilder
     */
    public function builder()
    {
        return $this->builder;
    }

    /**
     * @return billboardModel
     */
    public function newModel()
    {
        return new billboardModel();
    }

    /**
     * @return billboardQueryBuilder
     */
    public function newBuilder()
    {
        return (new billboardQueryBuilder())->table($this->model()->table(), $this->model()->alias());
    }

    /**
     * @param int $number
     *
     * @return $this
     */
    public function skip($number)
    {
        $this->builder()->offset($number);

        return $this;
    }

    /**
     * @param int $number
     *
     * @return $this
     */
    public function take($number)
    {
        $this->builder()->limit($number);

        return $this;
    }

    /**
     * @return array
     */
    public function items()
    {
        return $this->builder()->get();
    }

    /**
     * @return int
     */
    public function count()
    {
        return $this->builder()->count();
    }

    /**
     * @return int
     */
    public function pages()
    {
        return (int) ceil($this->count() / $this->limit());
    }

    /**
     * @param int $paginate
     *
     * @return $this
     */
    public function paginate($paginate)
    {
        $this->builder()->limit($paginate);

        return $this;
    }

    /**
     * @param int $page
     *
     * @return $this
     */
    public function page($page)
    {
        $limit = $this->limit();

        $offset = ($page - 1) * $limit;

        $this->builder()->limit($limit)->offset($offset);

        return $this;
    }

    /**
     * @param string $column
     * @param string $direction
     *
     * @return $this
     */
    public function sort($column, $direction)
    {
        $this->builder()->orderBy($column, $direction);

        return $this;
    }

    /**
     * @return int
     */
    public function limit()
    {
        return $this->model()->perPage();
    }
}
