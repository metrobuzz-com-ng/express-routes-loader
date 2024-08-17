export default (files: string[]) => {
    return files.filter((_) => !_.includes("index"));
};
