import { SettingsContext } from "@/core/utils/settingsContext";
import { Printer, printerTypes } from "@/printers/entities/Printer";
import { ActionIcon, Button, Group, Input, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlugConnected } from "@tabler/icons-react";
import useAxios from "axios-hooks";
import { useContext, useEffect } from "react";

type PrinterFormProps = {
    printer?: Printer
    onPrinterChange: (p: any) => void
}

export function PrinterForm({ printer, onPrinterChange }: PrinterFormProps) {
    const { local_backend } = useContext(SettingsContext);
    const form = useForm({
        initialValues: {
            ...printer,
        },
        validate: {
            name: (value) => (value.length < 2 ? 'Too short name' : null),
        },
    });
    const [{ loading }, executeSave] = useAxios({ method: 'POST' }, { manual: true })
    const [{ loading: cLoading }, executTest] = useAxios({ method: 'POST', url: `${local_backend}/printers/test` }, { manual: true })
    useEffect(() => {
        if (!printer) return;
        form.setValues(printer)
    }, [printer])
    const onSave = () => {
        const url = `${local_backend}/printers${printer?.uuid ? '/' + printer.uuid : ''}`
        executeSave({
            url,
            data: {
                ...form.values,
            }
        })
            .then(({ data }) => {
                onPrinterChange(data)
                notifications.show({
                    title: 'Great Success!',
                    message: 'Project updated',
                    color: 'indigo',
                })
            })
            .catch(({ message }) => {
                console.log(message)
                notifications.show({
                    title: 'Ops... Error updating project!',
                    message,
                    color: 'red',
                    autoClose: false
                })
            });
    };

    const connect = () => {
        if (form.values.address != '' && form.values.type != '') {
            const tyype = printerTypes.get(form.values.type)
            if (!tyype) return;
            executTest({ data: form.values })
                .then(({ data }) => {
                    form.setFieldValue('version', data.version)
                    form.setFieldValue('state', data.state)
                    form.setFieldValue('status', data.status)
                })
                .catch(({ message }) => {
                    console.log(message)
                    notifications.show({
                        title: 'Ops... Error connecting to the printer!',
                        message,
                        color: 'red',
                        autoClose: false
                    })
                });
        }

    }

    return (<>
        <form onSubmit={form.onSubmit(onSave)}>
            <TextInput
                mb="sm"
                label="Name"
                {...form.getInputProps('name')}
            />
            <Select
                mb="sm"
                label="Type"
                {...form.getInputProps('type')}
                data={Array.from(printerTypes.values()).map(t => t.type)} />
            <Input.Wrapper label="Address">
                <Input
                    placeholder="http://192.168.0.123"
                    rightSectionPointerEvents="all"
                    mb="sm"
                    {...form.getInputProps('address')}
                    rightSection={
                        <ActionIcon variant="filled" aria-label="Connect" onClick={connect} loading={cLoading}>
                            <IconPlugConnected style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    }
                />
            </Input.Wrapper>
            {form.values.version && <TextInput
                mb="sm"
                label="Status"
                disabled
                {...form.getInputProps('status')}
            />}
            {form.values.version && <TextInput
                mb="sm"
                label="Version"
                disabled
                {...form.getInputProps('version')}
            />}
            {form.values.version && <TextInput
                mb="sm"
                label="State"
                disabled
                {...form.getInputProps('state')}
            />}
            <Group justify="flex-end" mt="md">
                <Button type="submit" loading={loading} onClick={onSave}>Save</Button>
            </Group>
        </form>
    </>)
}