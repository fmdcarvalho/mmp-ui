import { AspectRatio, Card, Group, Image, LoadingOverlay, rem, Text } from '@mantine/core';
import classes from './SliceCard.module.css';
import { DropDownMenu } from '../../parts/drop-down-menu/DropDownMenu';
import { AssetCardProps } from '../../AssetCardProps';
import { SettingsContext } from '@/core/settings/settingsContext';
import { useCallback, useContext, useState } from 'react';
import { SendToPrinterBtn } from '@/printers/components/parts/sent-to-printer-btn/SendToPrinterBtn';
import { SetAsMain } from '../../parts/set-as-main/SetAsMain';
import { IconFile } from '@tabler/icons-react';

export function SliceCard({ projectUuid, asset, selected, onSelectChange, onDelete, onChange }: AssetCardProps) {

    const { settings } = useContext(SettingsContext);
    const [loading, setLoading] = useState(false);
    const toggleLoadingCallback = useCallback(() => {
        setLoading((l) => {
            return !l
        })
    }, [loading])

    const size = rem('280px');
    return (
        <Card withBorder padding="lg" radius="md" className={classes.card} style={{ minWidth: size, width: size, borderColor: selected ? 'red' : '' }}>
            <Card.Section mb="sm" onClick={() => onSelectChange(true)}>
                <AspectRatio ratio={16 / 9}>
                    {asset?.slice?.image_id === "" ? <IconFile /> :
                        <Image
                            src={`${settings.localBackend}/projects/${projectUuid}/assets/${asset?.slice?.image_id}`}
                            alt={asset.name}
                        />
                    }
                </AspectRatio>
            </Card.Section>

            <Text fw={700} className={classes.title} mt="xs" onClick={() => onSelectChange(true)}>
                {asset.name}
            </Text>

            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
            <Card.Section className={classes.footer}>
                <Group justify="flex-end">
                    <Group gap={0}>
                        <SendToPrinterBtn id={asset.id} />
                        <DropDownMenu
                            projectUuid={projectUuid}
                            id={asset.id}
                            openDetails={() => onSelectChange(true)}
                            downloadURL={`${settings.localBackend}/projects/${projectUuid}/assets/${asset?.id}?download=true'`}
                            onDelete={() => onDelete(projectUuid, asset.id)}
                            toggleLoad={toggleLoadingCallback}>
                            <SetAsMain projectUuid={projectUuid} assetId={asset.slice?.image_id} onChange={() => { onChange(projectUuid, asset.model?.image_id) }} />
                        </DropDownMenu>
                    </Group>
                </Group>
            </Card.Section>
        </Card>
    );
}