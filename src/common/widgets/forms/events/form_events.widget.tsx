import { useEventMutation } from "@/api/mutations/events/events.mutation"
import { Button } from "@/common/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/common/ui/form"
import { Input } from "@/common/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/common/ui/popover"
import { Switch } from "@/common/ui/switch"
import { Textarea } from "@/common/ui/textarea"
import { RegisterEventSchema, RegisterEventSchemaType } from "@/common/utils/schemas/events/register_events.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarCheck, CalendarIcon, Coffee, Store } from "lucide-react"
import { useForm } from "react-hook-form"
import MapSearch from "../../map/map_search.widget"

import { TimePicker } from "@/common/ui/time-picker"
import { combineDateTime } from "@/common/utils/dataTime.utils"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card"
import { Calendar } from "@/common/ui/calendar"
import { useApprovedBranches } from "@/api/queries/branches/branch.query"
import Select from "react-select"

export const FormRegisterEvents = () => {
    const { mutateAsync: useRegisterEvent } = useEventMutation()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const start_time = searchParams.get("start_time")
    const { data: BranchesAll } = useApprovedBranches()

    const method = useForm<RegisterEventSchemaType>({
        resolver: zodResolver(RegisterEventSchema),
        defaultValues: {
            name: '',
            description: '',
            location: '',
            start_date: start_time ? new Date(start_time) : new Date(),
            is_free: true,
            organizer: 'Carlitos'
        }
    })

    function onSubmit(values: RegisterEventSchemaType) {

        const date_time_start = combineDateTime(values.start_date, values.start_time || "00:00")
        const data_time_end = combineDateTime(values.end_date, values.end_time || "00:00")
        const eventData = {
            name: values.name,
            description: values.description,
            start_date: date_time_start,
            end_date: data_time_end,
            location: values.location,
            is_free: values.is_free,
            organizer: values.organizer,
        }

        try {
            useRegisterEvent(eventData).then((res) => {
                navigate(`/admin/albums?event=${res.event.id}`)
            })
            method.reset()
        } catch (error) {

        }
    }

    const onLocationSelect = (lat: number, lng: number, address: string) => {
        method.setValue("location", address);

    };

    return (
        <div className="container h-[98vh] flex flex-col justify-self-center p-2 ">
            <Card className="relative bg-white rounded-xl p-6 h-full shadow-md border border-[#D4A76A]/20">
                <CardHeader className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center mb-2">
                        <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                            <CalendarIcon className="text-white" size={24} />
                        </div>
                        <CardTitle className="text-[#020F17] font-semibold text-xl">
                            Crear Evento
                        </CardTitle>
                    </div>
                    <div className="flex items-center space-x-1 ">
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                        <div className="text-[#DB8935]">●</div>
                        <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                    </div>
                    <p className="text-[#546F75] text-sm text-center max-w-xs">
                        "Completa el formulario para crear tu nuevo evento"
                    </p>

                    <div className="absolute opacity-5 -right-0 -top-0">
                        <CalendarCheck className="text-[#2B2B2B]" size={120} />
                    </div>

                </CardHeader>
                <CardContent className="relative mx-auto w-full max-w-6xl h-[60vh]  min-h-[50vh] overflow-y-auto scrollbar-subtle">
                    <Form {...method}>
                        <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6 px-2 ">
                            <FormField
                                control={method.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre del evento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del evento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={method.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descripción del evento (mínimo 10 caracteres)"
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        {/* <FormDescription>La descripción debe tener al menos 10 caracteres.</FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <FormField
                                        control={method.control}
                                        name="start_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Fecha de inicio</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => date < new Date()}
                                                        // initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={method.control}
                                        name="start_time"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Hora de inicio</FormLabel>
                                                <FormControl>
                                                    <TimePicker value={field.value} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={method.control}
                                        name="end_date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Fecha de fin</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                                            >
                                                                {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) => {
                                                                const startDate = method.getValues("start_date")
                                                                return startDate && date < startDate
                                                            }}
                                                        // initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={method.control}
                                        name="end_time"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Hora de fin</FormLabel>
                                                <FormControl>
                                                    <TimePicker value={field.value} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                control={method.control}
                                name="branch_ids"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sucursales</FormLabel>
                                        <FormControl>
                                            <Select
                                                isMulti
                                                options={BranchesAll?.map(branch => ({
                                                    value: branch.id,
                                                    label: branch.name
                                                })) || []}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Buscar sucursales..."
                                                noOptionsMessage={() => "No se encontraron sucursales"}
                                                onChange={(selected) => {
                                                    const selectedIds = selected.map(item => item.value);
                                                    field.onChange(selectedIds);
                                                }}
                                                value={BranchesAll?.filter(branch => field.value?.includes(branch.id))
                                                    .map(branch => ({
                                                        value: branch.id,
                                                        label: branch.name
                                                    })) || []}
                                            />
                                        </FormControl>
                                        <FormDescription>Selecciona las sucursales donde se realizará el evento</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                </div>
                            </div>


                            <div>


                                <FormField
                                    control={method.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="w-full  flex flex-col items-center justify-center">
                                            <FormLabel>Ubicación</FormLabel>
                                            <FormControl>
                                                <MapSearch
                                                    onLocationSelect={onLocationSelect}


                                                >

                                                </MapSearch>
                                                {/* <Input placeholder="Ubicación del evento" {...field} /> */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <p>aqui puedes confirmar tu dirección</p>
                                <FormField
                                    control={method.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            {/* <FormLabel>Organizador</FormLabel> */}
                                            <FormControl>
                                                <Input placeholder="Dirección" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={method.control}
                                name="is_free"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Evento gratuito</FormLabel>
                                            <FormDescription>Indica si el evento es gratuito o de pago</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={method.control}
                                name="organizer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organizador</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del organizador" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="w-full flex flex-col  items-center">
                                <Button type="submit" className="w-full md:w-2xl  bg-black text-white">
                                    Registrar Evento
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}