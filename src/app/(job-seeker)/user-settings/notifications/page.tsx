import LoadingSpinner from "@/components/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import db from "@/drizzle/db"
import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { getUserNotificationSettingsIdTag } from "@/features/userNotificationSettings/cache"
import { NotificationsForm } from "@/features/userNotificationSettings/components/NotificationsForm"
import getCurrentUser from "@/services/clerk/lib/getCurrentUser"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default function UserSettingsNotificationsPage() {
    return (
        <Suspense>
            <UserSettingsNotificationsPageSuspense />
        </Suspense>
    )
}

async function UserSettingsNotificationsPageSuspense() {
    const { userId } = await getCurrentUser()
    if (!userId) return notFound()
    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
            <Card>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                        <SuspendedForm userId={userId} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

async function SuspendedForm({ userId }: { userId: string }) {
    const notificationSettings = await getNotificationSettings(userId)

    return <NotificationsForm notificationSettings={notificationSettings} />
}

async function getNotificationSettings(userId: string) {
    "use cache"
    cacheTag(getUserNotificationSettingsIdTag(userId))

    return db.query.UserNotificationSettingsTable.findFirst({
        where: eq(UserNotificationSettingsTable.userId, userId),
        columns: {
            aiPrompt: true,
            newJobEmailNotifications: true,
        },
    })
}
