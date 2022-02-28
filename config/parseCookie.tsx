import cookie from "cookie";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export default function parseCookies(req: IncomingMessage & { cookies: NextApiRequestCookies; }) {
  return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}