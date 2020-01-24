<?php

class billboardQueryString
{
    protected $queryBuilder;

    public function __construct(billboardQueryBuilder $queryBuilder)
    {
        $this->queryBuilder = $queryBuilder;
    }

    public function constructQueryString()
    {
        $sqlParts = [
            $this->constructSelectSql(),
            $this->constructFromSql(),
            $this->constructJoinSql(),
            $this->constructWhereSql(),
            $this->constructGroupBySql(),
            $this->constructOrderBySql(),
            $this->constructLimitSql(),
            $this->constructOffsetSql()
        ];

        return implode(' ', array_filter($sqlParts));
    }

    public function constructSelectSql()
    {
        return 'SELECT ' . implode(', ', $this->queryBuilder->columns);
    }

    public function constructFromSql()
    {
        return 'FROM ' . $this->queryBuilder->table . (billboardValidation::notBlank($this->queryBuilder->as) ? ' AS ' . $this->queryBuilder->as : '');
    }

    public function constructJoinSql()
    {
        $joinSql = '';

        if (billboardValidation::notBlank($this->queryBuilder->joins)) {

            $sqlParts = [];

            foreach ($this->queryBuilder->joins as $join) {

                list($table, $first, $operator, $second, $conditions, $type) = $join;

                $sqlParts[] = implode(' ', [$type, 'JOIN', $table, 'ON', $first, $operator, $second, $this->constructJoinConditionsSql($conditions)]);
            }

            $joinSql = implode(' ', $sqlParts);
        }

        return $joinSql;
    }

    protected function constructJoinConditionsSql($conditions)
    {
        $conditionsSql = '';

        if (billboardValidation::notBlank($conditions)) {

            $sqlParts = [];

            foreach ($conditions as $condition) {

                list($first, $operator, $second, $type, $logic) = $condition;

                // $type = column | value;
                // if type = column, that means, this is a column to column condition
                // else if type = value, that means, we compare column to a value

                if ($type === 'value') {
                    $this->queryBuilder->addBinding($second);
                }

                $sqlParts[] = implode(' ', [$logic, $first, $operator, ($type === 'value' ? '?' : $second)]);
            }

            $conditionsSql = implode(' ', $sqlParts);
        }

        return $conditionsSql;
    }

    public function constructWhereSql()
    {
        $whereSql = '';

        if (billboardValidation::notBlank($this->queryBuilder->wheres)) {

            $sqlParts = [];

            foreach ($this->queryBuilder->wheres as $where) {

                $type = end($where);

                switch ($type) {
                    case 'basic':
                        $sqlParts[] = $this->constructBasicWhereSql($where);
                        break;
                    case 'basic not':
                        $sqlParts[] = $this->constructBasicNotWhereSql($where);
                        break;
                    case 'like':
                        $sqlParts[] = $this->constructLikeWhereSql($where);
                        break;
                    case 'not like':
                        $sqlParts[] = $this->constructNotLikeWhereSql($where);
                        break;
                    case 'in':
                        $sqlParts[] = $this->constructInWhereSql($where);
                        break;
                    case 'not in':
                        $sqlParts[] = $this->constructNotInWhereSql($where);
                        break;
                    case 'null':
                        $sqlParts[] = $this->constructNullWhereSql($where);
                        break;
                    case 'not null':
                        $sqlParts[] = $this->constructNotNullWhereSql($where);
                        break;
                    case 'between':
                        $sqlParts[] = $this->constructBetweenWhereSql($where);
                        break;
                    case 'not between':
                        $sqlParts[] = $this->constructNotBetweenWhereSql($where);
                        break;
                    case 'exists':
                        $sqlParts[] = $this->constructExistsWhereSql($where);
                        break;
                    case 'not exists':
                        $sqlParts[] = $this->constructNotExistsWhereSql($where);
                        break;
                    case 'raw':
                        $sqlParts[] = $this->constructRawWhereSql($where);
                        break;
                    default:
                        throw new waException('Unknown where implementation.');
                }
            }

            $whereSql = 'WHERE ' . implode(' ', $sqlParts);
        }

        return $whereSql;
    }

    protected function constructBasicWhereSql($where)
    {
        list($column, $operator, $value, $logic) = $where;

        $this->queryBuilder->addBinding($value);

        return implode(' ', [$logic, '(', $column, $operator, '?', ')']);
    }

    protected function constructBasicNotWhereSql($where)
    {
        list($column, $operator, $value, $logic) = $where;

        $this->queryBuilder->addBinding($value);

        return implode(' ', [$logic, 'NOT', '(', $column, $operator, '?', ')']);
    }

    protected function constructLikeWhereSql($where)
    {
        list($column, $value, $logic) = $where;

        $this->queryBuilder->addBinding($value);

        return implode(' ', [$logic, '(', $column, 'LIKE', '?', ')']);
    }

    protected function constructNotLikeWhereSql($where)
    {
        list($column, $value, $logic) = $where;

        $this->queryBuilder->addBinding($value);

        return implode(' ', [$logic, '(', $column, 'NOT LIKE', '?', ')']);
    }

    protected function constructInWhereSql($where)
    {
        list($column, $values, $logic) = $where;

        $this->queryBuilder->addBinding($values);

        return implode(' ', [$logic, '(', $column, 'IN', '(?)', ')']);
    }

    protected function constructNotInWhereSql($where)
    {
        list($column, $values, $logic) = $where;

        $this->queryBuilder->addBinding($values);

        return implode(' ', [$logic, '(', $column, 'NOT IN', '(?)', ')']);
    }

    protected function constructNullWhereSql($where)
    {
        list($column, $logic) = $where;

        return implode(' ', [$logic, '(', $column, 'IS NULL', ')']);
    }

    protected function constructNotNullWhereSql($where)
    {
        list($column, $logic) = $where;

        return implode(' ', [$logic, '(', $column, 'IS NOT NULL', ')']);
    }

    protected function constructBetweenWhereSql($where)
    {
        list($column, $begin, $end, $logic) = $where;

        $this->queryBuilder->addBinding($begin);

        $this->queryBuilder->addBinding($end);

        return implode(' ', [$logic, '(', $column, 'BETWEEN', '?', 'AND', '?', ')']);
    }

    protected function constructNotBetweenWhereSql($where)
    {
        list($column, $begin, $end, $logic) = $where;

        $this->queryBuilder->addBinding($begin);

        $this->queryBuilder->addBinding($end);

        return implode(' ', [$logic, '(', $column, 'NOT BETWEEN', '?', 'AND', '?', ')']);
    }

    protected function constructExistsWhereSql($where)
    {
        list($sql, $bindings, $logic) = $where;

        if (billboardValidation::notBlank($bindings)) {
            foreach ($bindings as $binding) {
                $this->queryBuilder->addBinding($binding);
            }
        }

        return implode(' ', [$logic, '(', 'EXISTS', '(', $sql, ')', ')']);
    }

    protected function constructNotExistsWhereSql($where)
    {
        list($sql, $bindings, $logic) = $where;

        if (billboardValidation::notBlank($bindings)) {
            foreach ($bindings as $binding) {
                $this->queryBuilder->addBinding($binding);
            }
        }

        return implode(' ', [$logic, '(', 'NOT EXISTS', '(', $sql, ')', ')']);
    }

    protected function constructRawWhereSql($where)
    {
        list($sql, $bindings, $logic) = $where;

        if (billboardValidation::notBlank($bindings)) {
            foreach ($bindings as $binding) {
                $this->queryBuilder->addBinding($binding);
            }
        }

        return implode(' ', [$logic, '(', $sql, ')']);
    }

    public function constructGroupBySql()
    {
        $groupBySql = '';

        if (billboardValidation::notBlank($this->queryBuilder->groups)) {
            $groupBySql = 'GROUP BY ' . implode(', ', $this->queryBuilder->groups);
        }

        return $groupBySql;
    }

    public function constructOrderBySql()
    {
        $orderBySql = '';

        if (billboardValidation::notBlank($this->queryBuilder->orders)) {

            $sqlParts = [];

            foreach ($this->queryBuilder->orders as $order) {

                list($column, $direction) = $order;

                $sqlParts[] = implode(' ', [$column, $direction]);
            }

            $orderBySql = 'ORDER BY ' . implode(', ', $sqlParts);
        }

        return $orderBySql;
    }

    protected function constructLimitSql()
    {
        return
            billboardValidation::positiveInt($this->queryBuilder->limit)
                ? 'LIMIT ' . $this->queryBuilder->limit
                : '';
    }

    protected function constructOffsetSql()
    {
        return
            billboardValidation::positiveInt($this->queryBuilder->offset)
                ? 'OFFSET ' . $this->queryBuilder->offset
                : '';
    }
}
