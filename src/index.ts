import { Hono } from "hono";

interface LinkPreview {
	title: string;
	description: string;
	favicon: string;
	ogImage: string;
}

class TitleHandler {
	title: string = "";
	text(text: Text) {
		if (!this.title && text.text) {
			this.title = text.text.trim();
		}
	}
}

class MetaHandler {
	description: string = "";
	ogImage: string = "";
	element(element: Element) {
		const property = element.getAttribute("property");
		const name = element.getAttribute("name");
		const content = element.getAttribute("content");

		if (property === "og:description" || name === "description") {
			this.description = content || "";
		} else if (property === "og:image") {
			this.ogImage = content || "";
		}
	}
}

class FaviconHandler {
	favicon: string = "";
	element(element: Element) {
		const rel = element.getAttribute("rel");
		if (rel === "icon" || rel === "shortcut icon") {
			const href = element.getAttribute("href");
			if (href) {
				this.favicon = href;
			}
		}
	}
}

const app = new Hono();

const toAbsoluteUrl = (baseUrl: string, relativeUrl: string): string => {
	try {
		return new URL(relativeUrl, baseUrl).toString();
	} catch (error) {
		return relativeUrl;
	}
};

app.get("/preview", async (c) => {
	const url = c.req.query("url");
	if (!url) {
		return c.json({ error: "URL parameter is required" }, 400);
	}

	try {
		const response = await fetch(url);
		if (!response.ok) {
			return c.json({ error: "Failed to fetch URL" }, response.status);
		}

		const titleHandler = new TitleHandler();
		const metaHandler = new MetaHandler();
		const faviconHandler = new FaviconHandler();

		const rewriter = new HTMLRewriter()
			.on("title", titleHandler)
			.on("meta", metaHandler)
			.on("link", faviconHandler);

		await rewriter.transform(response).text();

		const preview: LinkPreview = {
			title: titleHandler.title,
			description: metaHandler.description,
			favicon: toAbsoluteUrl(url, faviconHandler.favicon),
			ogImage: metaHandler.ogImage,
		};

		c.header("Cache-Control", "public, max-age=86400");
		return c.json(preview);
	} catch (error) {
		return c.json({ error: "Failed to process URL" }, 500);
	}
});

export default app;
