import http from "http";
import util from "util";
import type { HealthCheckConfig } from "./config";

const createHealthCheckServer = ({ port }: HealthCheckConfig) => {
  let isHealthOk = false;
  const server = http.createServer((req, res) => {
    if (req.url === "/healthz") {
      if (isHealthOk) {
        res.writeHead(204);
      } else {
        res.writeHead(500);
      }
    } else {
      res.writeHead(404);
    }
    res.end();
  });
  server.listen(port);
  const setHealthOk = (isOk: boolean) => {
    isHealthOk = isOk;
  };
  const closeHealthCheckServer = util.promisify(server.close.bind(server));
  return { closeHealthCheckServer, setHealthOk };
};

export default createHealthCheckServer;
