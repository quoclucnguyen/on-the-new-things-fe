import { Form, Table, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Card } from "@nextui-org/react";
import { RcFile } from "antd/es/upload";
import Excel from 'exceljs';
import * as dayjs from 'dayjs'
import { useState } from "react";
import '../../assets/css/tien-com.css';

interface Person {
    name: string;
    id: number;
}

interface Transaction {
    person: Person;
    money: number;
    pay?: boolean;
}

interface Day {
    id: number;
    day: string;
    people: Transaction[]
}

export default function TienComPage() {
    const [people, setPeople] = useState<Person[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    return <>
        <Card css={{ padding: '1rem' }}>
            <Upload.Dragger name="files" beforeUpload={(file: RcFile) => {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async (ev) => {
                    const workbook = new Excel.Workbook();
                    await workbook.xlsx.load(reader.result as unknown as any);
                    const worksheet = workbook.getWorksheet("Tiền cơm");
                    const people: Person[] = [];
                    const data: Day[] = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber > 1) {
                            const values = row?.model?.cells?.map(cell => cell?.value?.toString().trim());
                            const colors = row?.model?.cells?.map(cell => {
                                const fill = cell?.style?.fill as unknown as any;
                                return fill.pattern == 'solid';
                            });
                            if (values != undefined && values?.length > 0) {
                                if (rowNumber == 2) {
                                    values?.forEach((item, index) => {
                                        if (item) {
                                            people.push({ name: item, id: index });
                                        }
                                    });
                                    setPeople(people);
                                }
                                if (rowNumber > 2) {
                                    const day = dayjs(values[0] ?? '').format('DD/MM/YYYY');
                                    const peopleTmp: Transaction[] = [];
                                    values.forEach((item, index) => {
                                        const person = people.find(person => person.id == index);
                                        if (person) {
                                            const money = parseInt(item ?? '0');
                                            peopleTmp.push({
                                                person: person,
                                                money: isNaN(money) ? 0 : money,
                                                pay: colors ? colors[index] : false
                                            });
                                        }
                                    });
                                    data.push({ day: day, people: peopleTmp, id: rowNumber });
                                }
                            }

                        }

                    });
                    console.log(data);
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
            <Table dataSource={days}
                rowKey={'id'}
                bordered={true}
                columns={[
                    {
                        dataIndex: 'day',
                        align: 'center',
                        title: '#',
                    },
                    ...people.map((person) => {
                        return {
                            dataIndex: person.id,
                            title: person.name,
                            render: (_: any, record: Day) => {
                                const transaction = record.people.find(item => item.person.id == person.id);
                                const money = transaction?.money == 0 ? '' : transaction?.money;
                                return <div className="paid">{money}</div>
                            },
                        }
                    })
                ]}
            />
        </Card>
    </>
}