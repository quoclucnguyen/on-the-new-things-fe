import {Card, Grid, Text, Button, Row, Textarea, useInput} from "@nextui-org/react";

export function UtilityPage() {
    const {
        value: controlledValueResult,
        setValue: setControlledValueResult,
        reset: resetResult,
        bindings: bindingsResult,
    } = useInput("");
    return <>
        <Card css={{mw: "330px"}}>
            <Card.Header>
                <Text b>From list to array JSON</Text>
            </Card.Header>
            <Card.Divider/>
            <Card.Body css={{py: "$10"}}>
                <Textarea
                    minRows={2}
                    label={'Put text in here'}
                    onChange={(e) => {
                        const value = e.target.value;
                        const result = value.split('\n').filter(item => item.trim() != '');
                        setControlledValueResult(JSON.stringify(result, null, '\t'))
                    }}
                />
                <Textarea
                    minRows={10}
                    label={'Result'}
                    {...bindingsResult}
                    onClick={(e) => {
                        navigator.clipboard.writeText(e.currentTarget.value).then(() => {
                        });
                    }}
                />

            </Card.Body>
            <Card.Divider/>
        </Card>
        <br/>

    </>
}