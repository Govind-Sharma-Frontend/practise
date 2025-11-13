export interface ApiStateData {
    firstName: string;
    lastName: string;
}

export interface ResponseApiStateData {
    firstName: string;
    lastName: string;
    sirName: string;
}


// Interfaces for Ball and Paddle
export interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}

export interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}
