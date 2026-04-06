import http from "k6/http";
import { sleep } from "k6";

export const options = {
    vus: 100,
    duration: "60s"
};

export default function(){
    const res = http.post("http://localhost:3000?uname=Cool");
    sleep(1);
}
