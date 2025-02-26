
import { Button, Input, message, Skeleton, Table } from 'antd'
import styles from './ListLog.module.css'
import { SyncOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useEffect, useState } from 'react';
import { sorterTable } from '../utils/helper';

export default function ListLog() {
    const [dataTable, setDataTable] = useState<any>([])
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

    const fetchDataTable = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/Logging/logging-detail", tableParams);
            setIsLoading(false);
            if (data.isValid) {
                const listData = data.data.listData
                setDataTable((prev: any) => [...prev, ...listData])
                setTotalData(data.data.totalRecords);
            }
        } catch (e: any) {
            message.error(e.message || "Failed getting data");
        } finally {
            setIsLoading(false);
        }
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        if (extra?.action === "sort") {
            setDataTable([]);
            setTableParams(prevParams => {
                return {
                    ...prevParams,
                    pageNumber: 1,
                    orderBy: sorter?.field || prevParams?.orderBy,
                    isAscending: sorterTable(sorter?.order, prevParams?.isAscending)
                }
            });
        }

        // setTableParams((prevParams: any) => ({
        //     ...prevParams,
        //     pageNumber: pagination?.current,
        //     pageSize: pagination?.pageSize,
        //     orderBy: sorter?.field || prevParams?.orderBy,
        //     isAscending: sorterTable(sorter?.order, prevParams?.isAscending)
        // }));
        // if (pagination.pageSize !== tableParams?.pageSize) {
        //     setDataTable([]);
        // }
    };

    const onClickLoadMore = () => {
        setTableParams(prevParams => ({
            ...prevParams,
            pageNumber: prevParams.pageNumber + 1
        }))
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setDataTable([])
            setTotalData(0)
            setTableParams(prev => ({
                ...prev,
                pageNumber: 1,
                filter: {
                    ...filters
                }
            }))
        }, 1000);
        return () => clearTimeout(timeOutId);
    }, [filters])

    useEffect(() => {
        fetchDataTable()
    }, [JSON.stringify(tableParams)])

    const columns = [
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

    return (
        <div className={styles.container}>
            <section className={styles.section_header}>
                <div className={styles.section_header_search}>
                    <Input allowClear placeholder="Find by Trace Id" onChange={(e) => setFilters({ ...filters, traceId: e.target.value })} />
                    <Input allowClear placeholder="Find by Doc Number" onChange={(e) => setFilters({ ...filters, docNumber: e.target.value })} />
                    <Input allowClear placeholder="Find by Module" onChange={(e) => setFilters({ ...filters, module: e.target.value })} />
                    <Input allowClear placeholder="Find by Action" onChange={(e) => setFilters({ ...filters, action: e.target.value })} />
                </div>
                <Button icon={<SyncOutlined />} onClick={fetchDataTable}>Refresh</Button>
            </section>
            <section className={styles.section_table}>
                <Table
                    size='small'
                    bordered
                    columns={columns}
                    loading={isLoading}
                    dataSource={dataTable}
                    onChange={handleTableChange}
                    // pagination={{
                    //     position: ['bottomCenter'],
                    //     current: tableParams?.pageNumber,
                    //     pageSize: tableParams?.pageSize,
                    //     total: totalData,
                    //     pageSizeOptions: ["5", "10", "25", "50"],
                    //     showSizeChanger: true,
                    //     locale: { items_per_page: "" },
                    //     showTotal: (total, range) => {
                    //         return (
                    //             <span>
                    //                 Showing <strong>{range[0]}</strong>-
                    //                 <strong>{range[1]}</strong> of <strong>{total}</strong>
                    //             </span>
                    //         )
                    //     },
                    // }}
                    pagination={false}
                    sortDirections={["ascend", "descend", "ascend"]}
                />
                <div className={styles.section_table_loadmore}>
                    <div className={styles.load_more_button}>
                        <Button
                            loading={isLoading}
                            onClick={onClickLoadMore}
                            disabled={totalData <= (tableParams.pageNumber * tableParams.pageSize)}
                        >Load More</Button>
                    </div>
                    <div className={styles.load_more_information_total_data}>
                        {isLoading ? <Skeleton.Input active size='small' /> :
                            <p>{
                                `Showing ${dataTable?.length > 0 ? 1 : 0}-${(tableParams.pageNumber * tableParams.pageSize) > totalData ? totalData : (tableParams.pageNumber * tableParams.pageSize) || 0} of ${totalData}`}
                            </p>
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}
