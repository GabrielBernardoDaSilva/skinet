let data: boolean | string;


data = 'asda';

data = true;


interface ICar{
  color: string;
  model: string;
  topSpeed?: number;
}


const car1: ICar = {
  color: 'blue',
  model: 'bmw'
};

const car2: ICar = {
  color: 'red',
  model: 'mercedes',
  topSpeed: 100
};


const multiply = (x: number, y: number): number =>{
  return x * y;
};
const multiply1 = (x: number, y: number): void =>{
  x * y;
};
const multiply2 = (x: number, y: number): string =>{
  return (x * y).toString();
};
