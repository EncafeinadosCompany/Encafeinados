export interface EventDto {
    id?: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    is_free: boolean;
    organizer: string;
    value?:number;
    status?: string;
    branch_ids?: number[];
}


export interface EventClienType {
    idEvenClient: number,
		idEvent: number
  }