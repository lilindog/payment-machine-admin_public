export default {

    getDate (timestamp, dateSpacing = "-", centerSpacing = " ", timeSpacing = ":") {
        const d = timestamp ? new Date(timestamp) : new Date;
        let str = "";
        ["getFullYear", "getMonth", "getDate", "getHours", "getMinutes", "getSeconds"].forEach((k, i) => {
            let v = d[k]();
            if (k === "getMonth") str += v + 1 < 10 ? "0" + (v + 1) : v + 1;
            else str += v < 10 ? "0" + v : v;
            if (i < 2) str += dateSpacing;
            else if (i > 2) str += timeSpacing;
            else str += centerSpacing;
        });
        return str.slice(0, -1);
    },

    //构建navbar tag， 同意调用此方法创建，便于管理
    buildTagsChild () {
        return {
            active: false,
            title: "",
            path: ""
        }
    }
};