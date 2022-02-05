import { SuperURL } from "./index";

describe("SuperURL", () => {
    it("extends URL", () => {
        const u = new SuperURL("http://o7o.pl");

        must(u).be.instanceof(URL);
        must(u).be.instanceof(SuperURL);
    });

    it("autofills protocol if missing", () => {
        const u = new SuperURL("//o7o.pl");
        u.href.must.equal("http://o7o.pl/");

        const v = new SuperURL("//o7o.pl/", "https://some.base/url.php");
        v.href.must.equal("https://o7o.pl/");
    });

    // @TODO within domain

    it("gets file extension", () => {
        // @TODO add quesry string & hash + multiple hashes
        const u = new SuperURL("https://o7o.pl/some/file.php");
        u.fileExtension.must.equal("php");

        const t = new SuperURL("https://o7o.pl/some/file");
        t.fileExtension.must.equal("");

        const s = new SuperURL("https://o7o.pl/some.test/");
        s.fileExtension.must.equal("");

        const x = new SuperURL("https://o7o.pl");
        x.fileExtension.must.equal("");
    });

    // @TODO set file ext

    it("gets file name", () => {
        // @TODO add quesry string & hash + multiple hashes
        const u = new SuperURL("https://o7o.pl/some/file.php");
        u.fileName.must.equal("file.php");

        const t = new SuperURL("https://o7o.pl/some/file");
        t.fileName.must.equal("file");

        const s = new SuperURL("https://o7o.pl/some.test/");
        s.fileName.must.equal("");

        const x = new SuperURL("https://o7o.pl");
        x.fileName.must.equal("");
    });

    it("gets any name", () => {
        const u = new SuperURL("https://o7o.pl/some/file.php");
        u.anyName.must.equal("file.php");

        const p = new SuperURL("https://o7o.pl/some/");
        p.anyName.must.equal("some");

        const t = new SuperURL("https://o7o.pl:3000/");
        t.anyName.must.equal("o7o.pl");
    });

    // @TODO clone

    it("creates instace from relative", () => {
        const root = new SuperURL("https://o7o.pl:3000/path?search=true#hash");
        const rootWithSlash = new SuperURL("https://o7o.pl:3000/path/?search=true#hash");

        must(() => root.createFromRelative("")).throw("Empty URL");
        must(() => root.createFromRelative("data:image/png;etc")).throw("Can't create relative url from data URL");

        const replacedHttp = root.createFromRelative("http://kittens.pl/");
        replacedHttp.href.must.equal("http://kittens.pl/");

        must(replacedHttp).not.equal(root);

        const replacedHttps = root.createFromRelative("https://aaa.pl/");
        replacedHttps.href.must.equal("https://aaa.pl/");

        const replacedOther = root.createFromRelative("gopher://ccc.pl:123/not/index.php?aaa=bbb&ccc=ddd#hic");
        replacedOther.href.must.equal("gopher://ccc.pl:123/not/index.php?aaa=bbb&ccc=ddd#hic");

        const keptProtocol = root.createFromRelative("//dogs.pl:666/aaa/aaa.php?fff=fff#base");
        keptProtocol.href.must.equal("https://dogs.pl:666/aaa/aaa.php?fff=fff#base");

        const pathReplaced = root.createFromRelative("/newpath");
        pathReplaced.href.must.equal("https://o7o.pl:3000/newpath");

        const pathRelative = root.createFromRelative("newpath");
        pathRelative.href.must.equal("https://o7o.pl:3000/newpath");

        const pathRelativeSlash = rootWithSlash.createFromRelative("newpath");
        pathRelativeSlash.href.must.equal("https://o7o.pl:3000/path/newpath");

        const fullPathReplaced = root.createFromRelative("/other/?y=1#qwerty");
        fullPathReplaced.href.must.equal("https://o7o.pl:3000/other/?y=1#qwerty");
    });
});
