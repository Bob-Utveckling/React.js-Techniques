export function makeArrayOfWorkAreaNamesFromClusterName(getClusterName:string) {
    console.log("- returning workAreaNames to update the state with.")
    return getClusterName.split(",")
}

export function makeCleanWorkAreaIdsFromClusterName(getClusterName:string) {
    console.log("- returning workAreaIds to update the state with.")
    return getClusterName.split(",")
    .map(
      function(e:string) { e = e.toLowerCase()
        .replace(/[.,\#!$""¤%\^&\*;:{}=\-_`~()]/g,"")
        .replace(/\s/g,'')
        .replace(/[ö]/g,"o")
        .replace(/[ä]/g,"a")
        .replace(/[å]/g,"a")
        .replace(/[/]/g,"_"); return e;
      }
      )
}