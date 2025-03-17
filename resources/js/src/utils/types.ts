
interface Link {
    url: string;
    label: string;
    active: boolean;
}
export interface Response<T> {
    status: number;
    data: T[];
    links: Link[];
    from: number;
    to: number;
    total: number;
    per_page: number;
}
