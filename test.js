import http from "k6/http";
import { sleep } from "k6";

export const options = {
    vus: 83,
    duration: "50s"
};

export default function(){
    const res = http.post("http://localhost:3000");
    sleep(1);
}
