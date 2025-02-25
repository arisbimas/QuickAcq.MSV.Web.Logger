export function sorterTable(sorter: any, defaultSort: any) {
    if (sorter === "ascend") {
        return true
    } else if (sorter === "descend") {
        return false
    }
    return defaultSort
}