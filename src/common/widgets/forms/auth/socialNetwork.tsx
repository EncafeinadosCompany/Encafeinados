"use client"

import { useFieldArray, useFormContext, UseFormRegister } from "react-hook-form"
import { Trash2, Plus, Globe, Link as LinkIcon, MessageSquare } from "lucide-react"
import type { SocialNetworksType } from "@/api/queries/stores/socialNetworksQueries"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/common/ui/card"
import { Label } from "@/common/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Textarea } from "@/common/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

interface DynamicSocialNetworksFormProps {
    availableSocialNetworks: SocialNetworksType | undefined
    register: UseFormRegister<any>
    control: any
}

export default function SocialNetworksForm({ availableSocialNetworks, register, control }: DynamicSocialNetworksFormProps) {

    const { watch } = useFormContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "social_networks",
    })

    const socialNetworksWatched = watch("social_networks") ?? []

    const selectedNetworkIds = socialNetworksWatched.map((n: any) => n.social_network_id) || []


    const availableNetworks = availableSocialNetworks?.social.filter(
        (network) => !selectedNetworkIds.includes(network.id)
    )

    const handleAddNetwork = (networkIdStr: string) => {
        const networkId = parseInt(networkIdStr)
        const network = availableSocialNetworks?.social.find((n) => n.id === networkId)
        if (!network) return

        append({
            social_network_id: networkIdStr,
            url: "",
            name: network.name,
            description: "",
        })
    }
    return (
        <Card className="w-full max-w-3xl mx-auto shadow-md border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Globe className="h-5 w-5 text-primary" />
                    Social Networks
                </CardTitle>
                <CardDescription>
                    Connect your store with your social media presence
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
                {/* Selector with improved styling */}
                <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="network-select" className="text-sm font-medium">
                            Add social network
                        </Label>
                        <Select
                            onValueChange={handleAddNetwork}
                            disabled={availableNetworks?.length === 0}
                        >
                            <SelectTrigger id="network-select" className="bg-background border-input/60 focus:ring-primary/20">
                                <SelectValue
                                    placeholder={
                                        availableNetworks?.length === 0
                                            ? "No more networks available"
                                            : "Select a social network"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {availableNetworks?.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                        No more networks available
                                    </div>
                                ) : (
                                    availableNetworks?.map((network) => (
                                        <SelectItem key={network.id} value={network.id.toString()}>
                                            {network.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Empty state with illustration */}
                <AnimatePresence>
                    {fields.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-10 px-6 border border-dashed rounded-lg border-muted-foreground/30"
                        >
                            <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                            <p className="text-muted-foreground font-medium">No social networks added yet</p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                Add your first social network using the selector above
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dynamic fields with animations */}
                <AnimatePresence>
                    <div className="space-y-4">
                        {fields.map((field, index) => {
                            const network = availableSocialNetworks?.social.find(
                                (n) => n.id === (field as any).social_network_id
                            )
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="border border-border/50 shadow-sm hover:shadow transition-all duration-200">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
                                            <CardTitle className="text-md font-medium flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <Globe className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                {(field as any).name}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="py-4 px-4 space-y-4">
                                            <input
                                                type="hidden"
                                                {...register(`social_networks.${index}.social_network_id`, { valueAsNumber: true })}
                                            />
                                            <div className="grid gap-2">
                                                <Label htmlFor={`url-${index}`} className="flex items-center gap-1.5">
                                                    <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                    URL
                                                </Label>
                                                <Input
                                                    id={`url-${index}`}
                                                    placeholder="https://example.com/page"
                                                    className="focus-visible:ring-primary/20"
                                                    {...register(`social_networks.${index}.url`)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`description-${index}`} className="flex items-center gap-1.5">
                                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id={`description-${index}`}
                                                    placeholder="Official page or description"
                                                    className="min-h-[80px] focus-visible:ring-primary/20"
                                                    {...register(`social_networks.${index}.description`)}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </AnimatePresence>
            </CardContent>
        </Card>

    )
}
