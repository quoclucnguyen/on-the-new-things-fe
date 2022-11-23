import { Form, Statistic, Table, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Card, Grid } from "@nextui-org/react";
import { RcFile } from "antd/es/upload";
import Excel from 'exceljs';
import dayjs from 'dayjs'
import { useEffect, useState } from "react";
import '../../assets/css/tien-com.css';
import { Bar } from '@ant-design/plots';
import { sortBy } from 'sort-by-typescript';

interface Person {
    name: string;
    id: number;
    label: string;
}

interface Transaction {
    person: Person;
    money: number;
    pay?: boolean;
    delivery?: boolean;
}

interface Day {
    id: number;
    day: string;
    people: Transaction[]
}

interface DataChartItem {
    name: string;
    totalMoney: number;
    status: string;
}

export default function TienComPage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    const [totalMoney, setTotalMoney] = useState<number>(0);
    const [paidMoney, setPaidMoney] = useState<number>(0);
    const [unPayMoney, setUnPayMoney] = useState<number>(0);
    const [dataChart, setDataChart] = useState<DataChartItem[]>([]);

    useEffect(() => {
        let total = 0;
        let paid = 0;
        let unPay = 0;
        const peopleInListPaid: { name: string, totalMoney: number, status: string }[] = [];
        const peopleInListUnPay: { name: string, totalMoney: number, status: string }[] = [];

        days.forEach(day => {
            day.people.forEach(transaction => {
                total += transaction.money;
                if (transaction.pay) {
                    paid += transaction.money;
                    const personIndex = peopleInListPaid.findIndex(item => item.name == transaction.person.name);
                    if (personIndex > -1) {
                        peopleInListPaid[personIndex].totalMoney += transaction.money * 1000;
                    } else {
                        peopleInListPaid.push({
                            name: transaction.person.name,
                            totalMoney: transaction.money,
                            status: "Paid"
                        })
                    }
                } else {
                    unPay += transaction.money;
                    const personIndex = peopleInListUnPay.findIndex(item => item.name == transaction.person.name);
                    if (personIndex > -1) {
                        peopleInListUnPay[personIndex].totalMoney += transaction.money * 1000;
                    } else {
                        peopleInListUnPay.push({
                            name: transaction.person.name,
                            totalMoney: transaction.money,
                            status: "UnPay"
                        })
                    }
                }
            });
        });
        setTotalMoney(total * 1000);
        setUnPayMoney(unPay * 1000);
        setPaidMoney(paid * 1000);
        setDataChart([...peopleInListPaid, ...peopleInListUnPay]);
    }, [days]);

    return <>
        <Card css={{ padding: '1rem' }}>
            <Upload.Dragger name="files" beforeUpload={(file: RcFile) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async (ev) => {
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(reader.result as unknown as any);
                    const worksheeTienCom = workbook.getWorksheet("Tiền cơm");
                    const worksheeDiLayCom = workbook.getWorksheet("Đi lấy cơm");
                    const people: Person[] = [];
                    const data: Day[] = [];
                    worksheeTienCom.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            const values = row?.model?.cells?.map(cell => cell?.value?.toString().trim());
                            if (values != undefined && values?.length > 0) {
                                if (rowNumber == 2) {
                                    row?.model?.cells?.forEach((item, index) => {
                                        if (item?.value?.toString()) {
                                            people.push({ name: item?.value?.toString()?.trim() ?? '', id: index, label: Array.from(item?.address?.toString())[0] ?? '' });
                                        }
                                    });
                                    setPeople(people);
                                }
                                if (rowNumber > 2) {
                                    const day = dayjs(values[0] ?? '').format('DD/MM/YYYY');
                                    const peopleTmp: Transaction[] = [];
                                    row?.model?.cells?.forEach((item, index) => {
                                        const person = people.find(person => person.label == Array.from(item?.address.toString())[0]);
                                        if (person) {
                                            const money = parseInt(item?.value?.toString()?.trim() ?? '0');
                                            const fill = item?.style?.fill as unknown as any;
                                            peopleTmp.push({
                                                person: person,
                                                money: isNaN(money) ? 0 : money,
                                                pay: fill.pattern == 'solid'
                                            });
                                        }
                                    });
                                    data.push({ day: day, people: peopleTmp, id: rowNumber });
                                }
                            }
                        }
                    });
                    const peopleDiLayCom: Person[] = [];
                    worksheeDiLayCom.eachRow((row, rowNumber: number) => {
                        if (rowNumber === 1) {
                            row?.model?.cells?.forEach((item, index) => {
                                if (item?.value?.toString()) {
                                    peopleDiLayCom.push({ name: item?.value?.toString()?.trim() ?? '', id: index, label: Array.from(item?.address?.toString())[0] ?? '' });
                                }
                            });
                        }
                        if (rowNumber > 2) {
                            const values = row?.model?.cells?.map(cell => cell?.value?.toString().trim());
                            const day = dayjs(values ? values[0] : '').format('DD/MM/YYYY');
                            const dayTransactionIndex = data.findIndex(item => item.day === day);
                            if (dayTransactionIndex > -1) {
                                row?.model?.cells?.forEach((item, index) => {
                                    const fill = item?.style?.fill as unknown as any;
                                    if (fill.pattern == 'solid') {
                                        const person = peopleDiLayCom.find(person => person.label == Array.from(item?.address.toString())[0]);
                                        const personDayIndex = data[dayTransactionIndex].people.findIndex(item => item.person.name.toLowerCase() == person?.name.toLowerCase());
                                        if (dayTransactionIndex === 0 || dayTransactionIndex === 7) {
                                        }
                                        if (personDayIndex > -1) {
                                            data[dayTransactionIndex].people[personDayIndex].delivery = true;
                                        }
                                    }
                                });
                            }
                        }
                    });
                    setDays(data);
                }
                return false;
            }}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>
        </Card>
        <br />
        <Card css={{ padding: '1rem' }}>
            <Grid.Container gap={2} justify="center">
                <Grid xs={4}>
                    <Statistic title="Tổng tiền" value={totalMoney} suffix={'VND'} />
                </Grid>
                <Grid xs={4}>
                    <Statistic title="Tiền đã trả" value={paidMoney} suffix={'VND'} />
                </Grid>
                <Grid xs={4}>
                    <Statistic title="Tiền chưa trả" value={unPayMoney} suffix={'VND'} />
                </Grid>
            </Grid.Container>
        </Card>
        <br />
        <Card css={{ padding: '1rem' }}>
            <Bar data={dataChart.sort(sortBy('-totalMoney'))}
                xField={'totalMoney'}
                yField='name'
                seriesField='status'
                isStack={true}
            />
        </Card>
        <br />
        <Card css={{ padding: '1rem' }}>
            <Table dataSource={days}
                rowKey={'id'}
                bordered={true}
                columns={[
                    {
                        dataIndex: 'day',
                        align: 'center',
                        title: '#',
                        filterSearch: true,
                        onFilter: (value, record) => record.id == value,
                        filters: [
                            ...days.map(item => {
                                return { text: item.day, value: item.id };
                            })
                        ],
                    },
                    ...people.map((person) => {
                        return {
                            dataIndex: person.id,
                            title: person.name,
                            render: (_: any, record: Day) => {
                                const transaction = record.people.find(item => item.person.id == person.id);
                                const money = transaction?.money == 0 ? '' : transaction?.money;
                                return transaction?.pay ? <div className="paid">{money}</div> : <div className="not-pay">{money}</div>;
                            },
                        }
                    })
                ]}
            />
        </Card>
        <br />

    </>
}