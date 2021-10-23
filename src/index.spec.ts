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

    // @TODO create from relative
});
