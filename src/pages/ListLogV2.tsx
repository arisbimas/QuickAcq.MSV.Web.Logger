
import { Button, Col, Input, message, Row, Table, TablePaginationConfig } from 'antd'
import styles from './ListLog.module.css'
import { SyncOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useEffect, useRef, useState } from 'react';
import { sorterTable } from '../utils/helper';
import _ from 'lodash';
import { ColumnsType, FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";

type DataTableState = {
    traceId: string,
    docNumber: string,
    process: string,
    module: string,
    action: string,
    timestamp: string,
    detail: string,
}

export default function ListLogV2() {
    const observerTarget = useRef<HTMLDivElement>(null);
    const [dataTable, setDataTable] = useState<DataTableState[]>([])
    const [totalData, setTotalData] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState({
        traceId: "",
        docNumber: "",
        module: "",
        action: "",
        prDateFrom: "",
        prDateTo: "",
        keyword: ""
    })
    const [tableParams, setTableParams] = useState({
        pageNumber: 1,
        pageSize: 10,
        orderBy: "timestamp",
        isAscending: true,
        filter: {
            ...filters
        }
    });
    const hasMoreData = !(totalData <= (tableParams.pageNumber * tableParams.pageSize))

    const fetchDataTable = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/Logging/logging-detail", tableParams);
            setIsLoading(false);
            if (data.isValid) {
                const listData = data.data.listData
                setDataTable((prev: DataTableState[]) => [...prev, ...listData])
                setTotalData(data.data.totalRecords);
            }
        } catch (error: unknown) {
            // Proper error handling with type assertion
            const errorMessage = error instanceof Error
                ? error.message
                : "Failed getting data";
            message.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<DataTableState> | SorterResult<DataTableState>[],
        extra: TableCurrentDataSource<DataTableState>
    ) => {
        if (extra.action === "sort") {
            setIsLoading(true);
            setDataTable([]);
            setTableParams(prevParams => {
                // Handle single sorter or multiple sorters
                const singleSorter = !Array.isArray(sorter) ? sorter : sorter[0];
                return {
                    ...prevParams,
                    pageNumber: 1,
                    orderBy: singleSorter.field?.toString() || prevParams?.orderBy,
                    isAscending: sorterTable(singleSorter?.order, prevParams?.isAscending)
                }
            });
        }
    };

    const onClickLoadMore = () => {
        setTableParams(prevParams => ({
            ...prevParams,
            pageNumber: prevParams.pageNumber + 1
        }))
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            if (!_.isEqual(tableParams.filter, filters)) {
                setDataTable([])
                setTotalData(0)
                setTableParams(prev => ({
                    ...prev,
                    pageNumber: 1,
                    filter: {
                        ...filters
                    }
                }))
            }
        }, 1000);
        return () => clearTimeout(timeOutId);
    }, [filters])

    useEffect(() => {
        fetchDataTable()
    }, [JSON.stringify(tableParams)])

    const columns: ColumnsType<DataTableState> = [
        {
            key: 'no',
            title: 'NO',
            dataIndex: 'no',
            render: (text, record, index) => index + 1
        },
        {
            key: 'traceId',
            title: 'TRACE ID',
            dataIndex: 'traceId',
            sorter: true
        },
        {
            key: 'docNumber',
            title: 'DOC NUMBER',
            dataIndex: 'docNumber',
            sorter: true
        },
        {
            key: 'process',
            title: 'PROCESS',
            dataIndex: 'process',
            sorter: true
        },
        {
            key: 'module',
            title: 'MODULE',
            dataIndex: 'module',
            sorter: true
        },
        {
            key: 'action',
            title: 'ACTION',
            dataIndex: 'action',
            sorter: true
        },
        {
            key: 'item',
            title: 'ITEM',
            dataIndex: 'item',
            sorter: true
        },
        {
            key: 'description',
            title: 'DESCRIPTION',
            dataIndex: 'description',
            sorter: true
        },
        {
            key: 'timestamp',
            title: 'TIMESTAMP',
            dataIndex: 'timestamp',
            sorter: true
        },

    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMoreData && dataTable.length > 0) {
                    onClickLoadMore()
                }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMoreData, isLoading])

    return (
        <div className={styles.container}>
            <section className={styles.section_header}>
                <div className={styles.section_header_search}>
                    <Row gutter={[8, 8]}>
                        <Col>
                            <Input allowClear placeholder="Find by Trace Id" onChange={(e) => setFilters({ ...filters, traceId: e.target.value })} />
                        </Col>
                        <Col>
                            <Input allowClear placeholder="Find by Doc Number" onChange={(e) => setFilters({ ...filters, docNumber: e.target.value })} />
                        </Col>
                        <Col>
                            <Input allowClear placeholder="Find by Module" onChange={(e) => setFilters({ ...filters, module: e.target.value })} />
                        </Col>
                        <Col>
                            <Input allowClear placeholder="Find by Action" onChange={(e) => setFilters({ ...filters, action: e.target.value })} />
                        </Col>
                    </Row>
                </div>
                <Button
                    icon={<SyncOutlined />}
                    onClick={() => {
                        setDataTable([]);
                        setTableParams(prevParams => ({
                            ...prevParams,
                            pageNumber: 1
                        }))
                    }}
                >
                    Refresh
                </Button>
            </section>
            <section className={styles.section_table}>
                <Table
                    size='small'
                    bordered
                    scroll={{ x: "max-content" }}
                    columns={columns}
                    loading={isLoading}
                    dataSource={dataTable}
                    onChange={handleTableChange}
                    pagination={false}
                    sortDirections={["ascend", "descend", "ascend"]}
                />
                {isLoading && <div style={{ textAlign: "center", margin: "20px 0" }}>Loading...</div>}
                {!hasMoreData && !isLoading && totalData > 0 && <div style={{ textAlign: "center", margin: "20px 0" }}>No more data</div>}
                {/* Sentinel */}
                <div ref={observerTarget} style={{ height: "20px" }} />
            </section>
        </div>
    )
}
