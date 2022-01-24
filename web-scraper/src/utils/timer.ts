export const startTimer = (message: string) => {
    console.log(message);
    return process.hrtime();
}

export const stopTimer = (timer: any, message: string) => {
    const stopped = process.hrtime(timer)
    const time = Number((stopped[0] + (stopped[1] / 1e9)).toFixed(5));
    console.log(message + time);

    return time;
}