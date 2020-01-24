<?php

class billboardQueryBuilder
{
    // @todo
    // @see https://www.w3schools.com/sql/sql_operators.asp

    public $table;

    public $as;

    public $distinct = false;

    public $columns = [];

    public $joins = [];

    public $wheres = [];

    public $groups = [];

    public $orders = [];

    public $unions = [];

    public $limit;

    public $offset;

    public $bindings = [];


    protected $model;

    const PRE_PERCENTAGE = '%LIKE';
    const POST_PERCENTAGE = 'LIKE%';
    const SURROUND_PERCENTAGE = '%LIKE%';

    const PRE_UNDERSCORE = '_LIKE';
    const POST_UNDERSCORE = 'LIKE_';
    const SURROUND_UNDERSCORE = '_LIKE_';

    public function __construct($model = null)
    {
        $this->model = $model instanceof waModel
            ? $model
            : new waModel();
    }

    public function table($table, $as = null)
    {
        $this->table = $table;

        $this->as = $as;

        return $this;
    }

    public function select($columns = ['*'])
    {
        $this->columns = $columns;

        return $this;
    }

    public function distinct()
    {
        $this->distinct = true;

        return $this;
    }

    public function from($table, $as = null)
    {
        $this->table = $table;

        $this->as = $as;

        return $this;
    }

    public function where($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, null, 'basic'];

        return $this;
    }

    public function orWhere($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, 'OR', 'basic'];

        return $this;
    }

    public function andWhere($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, 'AND', 'basic'];

        return $this;
    }

    public function whereNot($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, null, 'basic not'];

        return $this;
    }

    public function orWhereNot($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, 'OR', 'basic not'];

        return $this;
    }

    public function andWhereNot($column, $operator, $value)
    {
        $this->wheres[] = [$column, $operator, $value, 'AND', 'basic not'];

        return $this;
    }

    public function whereLike($column, $value)
    {
        $this->wheres[] = [$column, $value, null, 'like'];

        return $this;
    }

    public function orWhereLike($column, $value)
    {
        $this->wheres[] = [$column, $value, 'OR', 'like'];

        return $this;

    }

    public function andWhereLike($column, $value)
    {
        $this->wheres[] = [$column, $value, 'AND', 'like'];

        return $this;
    }

    public function whereNotLike($column, $value)
    {
        $this->wheres[] = [$column, $value, null, 'not like'];

        return $this;
    }

    public function orWhereNotLike($column, $value)
    {
        $this->wheres[] = [$column, $value, 'OR', 'not like'];

        return $this;
    }

    public function andWhereNotLike($column, $value)
    {
        $this->wheres[] = [$column, $value, 'AND', 'not like'];

        return $this;
    }

    public function whereIn($column, $values)
    {
        $this->wheres[] = [$column, $values, null, 'in'];

        return $this;
    }

    public function orWhereIn($column, $values)
    {
        $this->wheres[] = [$column, $values, 'OR', 'in'];

        return $this;
    }

    public function andWhereIn($column, $values)
    {
        $this->wheres[] = [$column, $values, 'AND', 'in'];

        return $this;
    }

    public function whereNotIn($column, $values)
    {
        $this->wheres[] = [$column, $values, null, 'not in'];

        return $this;
    }

    public function orWhereNotIn($column, $values)
    {
        $this->wheres[] = [$column, $values, 'OR', 'not in'];

        return $this;
    }

    public function andWhereNotIn($column, $values)
    {
        $this->wheres[] = [$column, $values, 'AND', 'not in'];

        return $this;
    }

    public function whereNull($column)
    {
        $this->wheres[] = [$column, null, 'null'];

        return $this;
    }

    public function orWhereNull($column)
    {
        $this->wheres[] = [$column, 'OR', 'null'];

        return $this;
    }

    public function andWhereNull($column)
    {
        $this->wheres[] = [$column, 'AND', 'null'];

        return $this;
    }

    public function whereNotNull($column)
    {
        $this->wheres[] = [$column, null, 'not null'];

        return $this;
    }

    public function orWhereNotNull($column)
    {
        $this->wheres[] = [$column, 'OR', 'not null'];

        return $this;
    }

    public function andWhereNotNull($column)
    {
        $this->wheres[] = [$column, 'AND', 'not null'];

        return $this;
    }

    public function whereBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, null, 'between'];

        return $this;
    }

    public function orWhereBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, 'OR', 'between'];

        return $this;
    }

    public function andWhereBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, 'AND', 'between'];

        return $this;
    }

    public function whereNotBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, null, 'not between'];

        return $this;
    }

    public function orWhereNotBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, 'OR', 'not between'];

        return $this;
    }

    public function andWhereNotBetween($column, $begin, $end)
    {
        $this->wheres[] = [$column, $begin, $end, 'AND', 'not between'];

        return $this;
    }

    public function whereExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, null, 'exists'];

        return $this;
    }

    public function orWhereExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'OR', 'exists'];

        return $this;
    }

    public function andWhereExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'AND', 'exists'];

        return $this;
    }

    public function whereNotExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, null, 'not exists'];

        return $this;
    }

    public function orWhereNotExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'OR', 'not exists'];

        return $this;
    }

    public function andWhereNotExists($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'AND', 'not exists'];

        return $this;
    }

    public function whereRaw($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, null, 'raw'];

        return $this;
    }

    public function orWhereRaw($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'OR', 'raw'];

        return $this;
    }

    public function andWhereRaw($sql, $bindings = [])
    {
        $this->wheres[] = [$sql, $bindings, 'AND', 'raw'];

        return $this;
    }

    public function crossJoin()
    {

    }

    public function innerJoin($table, $first, $operator, $second, $conditions = [])
    {
        $this->joins[] = [$table, $first, $operator, $second, $conditions, 'INNER'];

        return $this;

    }

    public function leftJoin($table, $first, $operator, $second, $conditions = [])
    {
        $this->joins[] = [$table, $first, $operator, $second, $conditions, 'LEFT'];

        return $this;
    }

    public function rightJoin($table, $first, $operator, $second, $conditions = [])
    {
        $this->joins[] = [$table, $first, $operator, $second, $conditions, 'RIGHT'];

        return $this;
    }

    public function groupBy($column)
    {
        $this->groups[] = $column;

        return $this;
    }

    public function orderBy($column, $direction = 'ASC')
    {
        $this->orders[] = [$column, $direction];

        return $this;
    }

    public function limit($limit)
    {
        $this->limit = $limit;

        return $this;
    }

    public function offset($offset)
    {
        $this->offset = $offset;

        return $this;
    }

    public function get($columns = ['*'])
    {
        if (billboardValidation::blank($this->columns)) {
            $this->select($columns);
        }

//        wa_dumpc(
//            $this->getQueryString(),
//            $this->getQueryBindings()
//        );

        return $this->getModel()->query($this->getQueryString(), $this->getQueryBindings())->fetchAll('id');
    }

    public function count()
    {
        $clone = $this->cloneWithout(['columns', 'groups', 'bindings', 'orders', 'offset', 'limit']);

        $clone->select(["COUNT(*) AS `count`"]);

//        wa_dumpc(
//            $clone->getQueryString(),
//            $clone->getQueryBindings()
//        );

        return (int) $clone->getModel()->query($clone->getQueryString(), $clone->getQueryBindings())->fetchField('count');
    }

    public function cloneWithout($properties)
    {
        $clone = clone $this;

        foreach ($properties as $property) {
            $clone->$property = null;
        }

        return $clone;
    }

    /**
     * @param mixed $value
     */
    public function addBinding($value)
    {
        $this->bindings[] = $value;
    }

    /**
     * @return array
     */
    public function getQueryBindings()
    {
        return $this->bindings;
    }


    public function escapeLike($value, $char = '\\')
    {
        return str_replace(
            [$char, '%', '_'],
            [$char . $char, $char . '%', $char . '_'],
            $value
        );
    }


    public function getQueryString()
    {
        return (new billboardQueryString($this))->constructQueryString();
    }

    protected function unifyColumns($columns)
    {
        $this->columns = array_unique(array_merge($this->columns, $columns));
    }

    protected function constructSelectSql()
    {
        return 'SELECT ' . implode(', ', $this->columns);
    }

    protected function constructFromSql()
    {
        return "FROM `{$this->getModel()->getTableName()}`" . (billboardValidation::notBlank($this->as) ? " AS `{$this->as}`" : '');
    }

    protected function constructJoinSql()
    {
        $joinSql = '';

        if (billboardValidation::notBlank($this->joins)) {

            foreach ($this->joins as $join) {

                list($table, $first, $operator, $second, $conditions, $type) = $join;

                $joinSql .= implode(' ', [$type, 'JOIN', $table, 'ON', $first, $operator, $second, $this->resolveJoinConditions($conditions)]);
            }
        }

        return $joinSql;
    }

    protected function resolveJoinConditions($conditions = [])
    {
        $conditionsSql = '';

        if (billboardValidation::notBlank($conditions)) {

            foreach ($conditions as $condition) {

                list($first, $operator, $second, $boolean) = $condition;

                $conditionsSql .= implode(' ', [$boolean, $first, $operator, $second]);
            }
        }

        return $conditionsSql;
    }

    protected function constructWhereSql()
    {
        $whereSql = '';

        if (billboardValidation::notBlank($this->wheres)) {

            $whereSql .= 'WHERE ';

            foreach ($this->wheres as $index => $where) {

                list($column, $operator, $value, $boolean) = $where;

                if ($index > 0 && $boolean !== null) {
                    $whereSql .= ' ' . $boolean . ' ';
                }

                $whereSql .= '(' . implode(' ', [$column, $operator, '(?)']) . ')';

                $this->addBinding($value);
            }
        }

        return $whereSql;
    }

    protected function constructWhereLikeSql()
    {
        $whereLikeSql = '';

        if (billboardValidation::notBlank($this->wheresLike)) {

            $whereLikeSql .= (billboardValidation::notBlank($this->wheres) ? '' : 'WHERE ');

            foreach ($this->wheresLike as $index => $where) {

                list($column, $wildcard, $value, $boolean) = $where;

                if ($index > 0 && $boolean !== null) {
                    $whereLikeSql .= ' ' . $boolean . ' ';
                }

                $whereLikeSql .= '(' . implode(' ', [$column, 'LIKE', '?']) . ')';

                $value = $this->escapeLike($value);

                $this->addBinding($this->resolveWildcardValue($wildcard, $value));
            }
        }

        return $whereLikeSql;
    }

    protected function resolveWildcardValue($wildcard, $value)
    {
        switch ($wildcard) {
            case self::PRE_PERCENTAGE:
                $value = '%' . $value;
                break;
            case self::POST_PERCENTAGE:
                $value = $value . '%';
                break;
            case self::SURROUND_PERCENTAGE:
                $value = '%' . $value . '%';
                break;
            case self::PRE_UNDERSCORE:
                $value = '_' . $value;
                break;
            case self::POST_UNDERSCORE:
                $value = $value . '_';
                break;
            case self::SURROUND_UNDERSCORE:
                $value = '_' . $value . '_';
                break;
        }

        return $value;
    }

    protected function constructGroupBySql()
    {
        $groupBySql = '';

        if (billboardValidation::notBlank($this->groups)) {
            $groupBySql .= 'GROUP BY ' . implode(', ', $this->groups);
        }

        return $groupBySql;
    }

    protected function constructOrderBySql()
    {
        $orderBySql = '';

        if (billboardValidation::notBlank($this->orders)) {

            $orderBySql .= 'ORDER BY ';

            $orders = [];

            foreach ($this->orders as $order) {

                list($column, $direction) = $order;

                $orders[] = implode(' ', [$column, $direction]);
            }

            $orderBySql .= implode(', ', $orders);
        }

        return $orderBySql;
    }

    protected function constructLimitSql()
    {
        return
            billboardValidation::positiveInt($this->limit)
                ? 'LIMIT ' . $this->limit
                : '';
    }

    protected function constructOffsetSql()
    {
        return
            billboardValidation::positiveInt($this->offset)
                ? 'OFFSET ' . $this->offset
                : '';
    }

    protected function getModel()
    {
        return $this->model;
    }
}
