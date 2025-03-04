
import { Button, Input, message, Skeleton, Table } from 'antd'
import styles from './ListLog.module.css'
import { SyncOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useEffect, useRef, useState } from 'react';
import { sorterTable } from '../utils/helper';
import _ from 'lodash';

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
    const isFirstLoadList = useRef(false);

    const fetchDataTable = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.post("/Logging/logging-detail", tableParams);
            setIsLoading(false);
            if (data.isValid) {
                const listData = data.data.listData
                setDataTable((prev: any) => [...prev, ...listData])
                setTotalData(data.data.totalRecords);
                if (isFirstLoadList.current) {
                    setTimeout(() => {
                        // Scroll ke bagian bawah halaman
                        window.scrollTo({
                            top: document.body.scrollHeight,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
                isFirstLoadList.current = true
            }

            // setDataTable([
            //     {
            //         traceId: "E001",
            //         docNumber: "DOC-2025-001",
            //         process: "Invoice Processing",
            //         module: "Finance",
            //         action: "Create",
            //         item: "Detailed invoice for Q1 2025 marketing campaign expenses including digital advertising, content creation, and social media management services provided by Agency XYZ (Reference: MKT-2025-Q1-001)",
            //         timestamp: "2025-02-24 09:30:15"
            //     },
            //     {
            //         traceId: "E002",
            //         docNumber: "DOC-2025-002",
            //         process: "Purchase Order",
            //         module: "Procurement",
            //         action: "Update",
            //         item: "Purchase order for new office equipment including 25 ergonomic chairs, 15 adjustable standing desks, and 10 dual-monitor setups for the expanding development team in Building B, Floor 3",
            //         timestamp: "2025-02-24 10:15:22"
            //     },
            //     {
            //         traceId: "E003",
            //         docNumber: "DOC-2025-003",
            //         process: "Payment Verification",
            //         module: "Finance",
            //         action: "Review",
            //         item: "Monthly vendor payment batch including software licenses, cloud services, and infrastructure maintenance fees for January 2025 - Total amount: $157,890.45 covering 12 different vendors",
            //         timestamp: "2025-02-24 11:20:33"
            //     },
            //     {
            //         traceId: "E004",
            //         docNumber: "DOC-2025-004",
            //         process: "Inventory Check",
            //         module: "Warehouse",
            //         action: "Verify",
            //         item: "Comprehensive inventory audit of warehouse section C-15 containing electronic components, including microprocessors, RAM modules, and storage devices from multiple manufacturers - Total SKUs: 456",
            //         timestamp: "2025-02-24 12:45:18"
            //     },
            //     {
            //         traceId: "E005",
            //         docNumber: "DOC-2025-005",
            //         process: "Employee Onboarding",
            //         module: "HR",
            //         action: "Create",
            //         item: "New employee onboarding package for Senior Software Engineer position including workstation setup, system access credentials, and orientation schedule for the Cloud Infrastructure team",
            //         timestamp: "2025-02-24 13:10:45"
            //     },
            //     {
            //         traceId: "E006",
            //         docNumber: "DOC-2025-006",
            //         process: "Contract Review",
            //         module: "Legal",
            //         action: "Approve",
            //         item: "Annual service agreement renewal with cloud infrastructure provider including updated terms for enhanced security measures, increased storage capacity, and premium support package for enterprise customers",
            //         timestamp: "2025-02-24 14:25:30"
            //     },
            //     {
            //         traceId: "E007",
            //         docNumber: "DOC-2025-007",
            //         process: "Sales Order",
            //         module: "Sales",
            //         action: "Create",
            //         item: "Enterprise software license package for multinational corporation including custom implementations, dedicated support team, and specialized training modules for 5000+ end users across 12 countries",
            //         timestamp: "2025-02-24 15:40:12"
            //     },
            //     {
            //         traceId: "E008",
            //         docNumber: "DOC-2025-008",
            //         process: "Quality Check",
            //         module: "Production",
            //         action: "Verify",
            //         item: "Quality assurance report for the new mobile application release covering functionality testing, performance optimization, security vulnerability assessment, and user interface validation across multiple devices",
            //         timestamp: "2025-02-24 16:15:55"
            //     },
            //     {
            //         traceId: "E009",
            //         docNumber: "DOC-2025-009",
            //         process: "Expense Claim",
            //         module: "Finance",
            //         action: "Review",
            //         item: "Travel expense report for international conference attendance including airfare, accommodation, meals, and transportation for three senior executives - Total duration: 5 days in Silicon Valley",
            //         timestamp: "2025-02-24 17:20:40"
            //     },
            //     {
            //         traceId: "E010",
            //         docNumber: "DOC-2025-010",
            //         process: "Maintenance Request",
            //         module: "Facilities",
            //         action: "Create",
            //         item: "Emergency maintenance request for data center cooling system malfunction affecting server room A-101 - Priority: High - Impact: Potential service disruption for North American clients",
            //         timestamp: "2025-02-24 18:05:25"
            //     },
            //     {
            //         traceId: "E011",
            //         docNumber: "DOC-2025-011",
            //         process: "Customer Complaint",
            //         module: "Customer Service",
            //         action: "Resolve",
            //         item: "Critical customer issue regarding system performance degradation during peak hours affecting multiple enterprise clients in the APAC region - Impact: 230,000 end users experiencing delayed responses",
            //         timestamp: "2025-02-24 09:45:30"
            //     },
            //     {
            //         traceId: "E012",
            //         docNumber: "DOC-2025-012",
            //         process: "Training Session",
            //         module: "HR",
            //         action: "Schedule",
            //         item: "Comprehensive cybersecurity awareness training program for all employees including modules on password security, phishing prevention, data protection, and compliance with industry regulations",
            //         timestamp: "2025-02-24 10:30:15"
            //     },
            //     {
            //         traceId: "E013",
            //         docNumber: "DOC-2025-013",
            //         process: "Supplier Evaluation",
            //         module: "Procurement",
            //         action: "Review",
            //         item: "Annual performance evaluation of key hardware suppliers including delivery times, product quality, pricing competitiveness, and after-sales support - Coverage period: January 2024 to December 2024",
            //         timestamp: "2025-02-24 11:55:20"
            //     },
            //     {
            //         traceId: "E014",
            //         docNumber: "DOC-2025-014",
            //         process: "Project Planning",
            //         module: "Project Management",
            //         action: "Update",
            //         item: "Project plan revision for the next-generation platform development including updated timeline, resource allocation, risk assessment, and budget adjustments for Phase 2 implementation",
            //         timestamp: "2025-02-24 13:25:45"
            //     },
            //     {
            //         traceId: "E015",
            //         docNumber: "DOC-2025-015",
            //         process: "Budget Review",
            //         module: "Finance",
            //         action: "Approve",
            //         item: "Q2 2025 departmental budget allocation review including IT infrastructure upgrades, software license renewals, staff training programs, and contingency funds for emergency maintenance",
            //         timestamp: "2025-02-24 14:50:30"
            //     },
            //     {
            //         traceId: "E016",
            //         docNumber: "DOC-2025-016",
            //         process: "Equipment Request",
            //         module: "IT",
            //         action: "Process",
            //         item: "Specialized development environment setup request including high-performance workstations, GPU clusters for AI model training, and dedicated network infrastructure for the Machine Learning team",
            //         timestamp: "2025-02-24 15:35:25"
            //     },
            //     {
            //         traceId: "E017",
            //         docNumber: "DOC-2025-017",
            //         process: "Security Audit",
            //         module: "Security",
            //         action: "Verify",
            //         item: "Quarterly security compliance audit report covering network infrastructure, application security, access control systems, and incident response procedures - Period: Q1 2025",
            //         timestamp: "2025-02-24 16:40:10"
            //     },
            //     {
            //         traceId: "E018",
            //         docNumber: "DOC-2025-018",
            //         process: "Leave Application",
            //         module: "HR",
            //         action: "Approve",
            //         item: "Extended leave request for senior project manager including handover documentation, project status reports, team reassignments, and coverage plan for ongoing projects during 3-month sabbatical",
            //         timestamp: "2025-02-24 17:15:55"
            //     },
            //     {
            //         traceId: "E019",
            //         docNumber: "DOC-2025-019",
            //         process: "Marketing Campaign",
            //         module: "Marketing",
            //         action: "Create",
            //         item: "Global product launch campaign strategy including digital marketing initiatives, social media campaigns, influencer partnerships, and event planning for new enterprise solution release",
            //         timestamp: "2025-02-24 18:20:40"
            //     },
            //     {
            //         traceId: "E020",
            //         docNumber: "DOC-2025-020",
            //         process: "Software Update",
            //         module: "IT",
            //         action: "Deploy",
            //         item: "Critical system update deployment plan including security patches, performance optimizations, and new feature rollout affecting 1.2 million users across 15 different time zones",
            //         timestamp: "2025-02-24 19:05:15"
            //     }
            // ]);
            // setTotalData(20);
            // setIsLoading(false);
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
