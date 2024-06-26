import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { AppShell, Burger, Group, LoadingOverlay } from '@mantine/core';
import { NavBar } from "./core/navbar/NavBar.tsx";
import { Outlet } from "react-router-dom";
import { AxiosErrorHandler } from './core/axios-error-handler/AxiosErrorHandler.tsx';
import { ScrollToTop } from './core/scroll-to-top/ScrollToTop.tsx';
import { DashboardProvider } from './dashboard/provider/DashboardProvider.tsx';
import { PrinterWidgetProvider } from './printers/providers/PrinterWidgetProvider.tsx';
import { SSEProvider } from './core/sse/SSEProvider.tsx';
import { SettingsProvider } from './core/settings/settingsProvider.tsx';
import { DiscoveryNotifications } from './system/components/discovery-notifications/DiscoveryNotifications.tsx';
import { NewProjectNotification } from './projects/notifications/new-project-notification/NewProjectNotification.tsx';
import { Notifications } from '@mantine/notifications';
import { NewTempfileNotification } from './tempfiles/notifications/new-tempfile-notification/NewTempfileNotification.tsx';

export default function App() {
    const [opened, { toggle }] = useDisclosure();
    const matches = useMediaQuery('(min-width: 900px)');

    return (
        <SettingsProvider
            loading={<LoadingOverlay visible={true} zIndex={1000} overlayProps={{ blur: 2 }} />}
        >
            <SSEProvider>
                <DashboardProvider>
                    <AppShell
                        withBorder={true}
                        header={{ height: 60, collapsed: matches }}
                        //footer={{height: 60}}
                        navbar={{ width: 80, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                        aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: true, mobile: true } }}
                        padding="md"
                    >
                        <AppShell.Header>
                            <Group h="100%" px="md">
                                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                            </Group>
                        </AppShell.Header>
                        <NavBar />
                        <AppShell.Main>
                            <Outlet />
                        </AppShell.Main>
                        <AppShell.Aside p="md">Aside</AppShell.Aside>
                    </AppShell>
                    <ScrollToTop />
                    <AxiosErrorHandler />
                    <NewProjectNotification />
                    <DiscoveryNotifications />
                    <NewTempfileNotification />
                    <PrinterWidgetProvider />
                    <Notifications limit={10} />
                </DashboardProvider>
            </SSEProvider>
        </SettingsProvider>
    )
}