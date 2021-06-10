export interface Customer {
    _id: string;
    name: string;
    gender: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    photo: string;
    hobbies: string[];
    creator?: string;
}

export interface IPagebleData<T> {
    message: string;
    customers: T[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
}