import booksData from "@/app/data/books.json";
import { logger, getRequestId } from "@/app/lib/logger";

export async function GET(request) {
  const requestId = getRequestId(request);
  const route = "/api/books [GET]";
  logger.info("request start", { requestId, route });
  try {
    const res = Response.json(booksData.books);
    logger.info("request success", { requestId, route, status: 200, count: booksData.books.length });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  const requestId = getRequestId(request);
  const route = "/api/books [POST]";
  logger.info("request start", { requestId, route });
  try {
    const newBook = await request.json();
    newBook.id = (booksData.books.length + 1).toString();
    booksData.books.push(newBook);
    const res = Response.json(newBook, { status: 201 });
    logger.info("request success", { requestId, route, status: 201, id: newBook.id });
    return res;
  } catch (error) {
    logger.error("request error", { requestId, route, error: String(error) });
    return Response.json({ message: "Bad Request" }, { status: 400 });
  }
}
