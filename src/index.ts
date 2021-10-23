import urlJoin from "url-join";

const last = <T>(arr: T[]) => {
    return arr[arr.length - 1];
};

class SuperURL extends URL {
    public constructor(rawUrl: string) {
        if (!rawUrl) {
            throw new Error("SuperURL requires an url");
        }
        let url = rawUrl;
        if (rawUrl.startsWith("//")) {
            url = "http:" + url;
        }
        super(url);
    }

    public isWithinDomain(domain: string) {
        if (domain === this.hostname) {
            return true;
        }

        const length = domain.split(".").length;
        const hostnameParts = this.hostname.split(".");
        if (length > hostnameParts.length) {
            return false;
        }

        const toRemove = hostnameParts.length - length;
        hostnameParts.splice(0, toRemove);

        const hostname = hostnameParts.join(".");
        return hostname === domain;
    }

    public get fileName() {
        const path = this.pathname.split("/");
        return last(path)!;
    }

    public get anyName() {
        const path = this.pathname.split("/").filter(Boolean);
        return last(path) || this.hostname;
    }

    public get fileExtension(): string {
        const parts = this.fileName.split(".");
        if (parts.length > 1) {
            return last(parts)!;
        }
        return "";
    }

    public set fileExtension(newExt: string | null) {
        const path = this.pathname.split("/");
        const lastPath = path.pop() ?? "";

        const parts = lastPath.split(".");
        if (newExt == null || newExt === "") {
            if (parts.length > 1) {
                parts.pop();
            }
        }
        else {
            if (parts.length > 1) {
                parts[parts.length - 1] = newExt;
            }
            else {
                parts.push(newExt);
            }
        }
        this.pathname = [...path, parts.join(".")].join("/");
    }

    public clone() {
        return new SuperURL(this.href);
    }

    public createFromRelative(relativeUrl: string | undefined | null) {
        if (!relativeUrl) {
            throw new Error("Empty URL");
        }
        if (relativeUrl.startsWith("data:")) {
            throw new Error("Can't create relative url from data URL");
        }
        if (/^[a-z]+:\/\//.exec(relativeUrl)) {
            return new SuperURL(relativeUrl);
        }
        if (relativeUrl.startsWith("//")) {
            return new SuperURL(this.protocol + relativeUrl);
        }
        if (relativeUrl.startsWith("/")) {
            const newUrl = this.clone();
            newUrl.pathname = relativeUrl;
            return newUrl;
        }
        // @TODO support for hash
        const u = this.clone();
        u.pathname = urlJoin(u.pathname, "/", relativeUrl);
        return u;
    }
}

export { SuperURL };
