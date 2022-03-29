// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // dev - old
  //  apiUrl: "https://jpdncore01.azurewebsites.net/api/",
  //  wpUrl: "https://jupiterwp.eastus2.cloudapp.azure.com/",
  //  designerUrl: "https://imprint.eastus2.cloudapp.azure.com/imprintNextDesigner/",
  //  storage: "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/",
   
  // stage - old
  // apiUrl: "https://stjpdncore02.azurewebsites.net/api/",
  // wpUrl: "https://stjupiterwp02.eastus2.cloudapp.azure.com/",
  // designerUrl: "https://stimprintnext2.eastus2.cloudapp.azure.com/designer/",
  // storage: "https://stjupiterstorage02.blob.core.windows.net/jupiterblob01/"

/**********************************************************************************************/

  // dev - new
  apiUrl: "https://jupiteradmindev.areswear.com/api/",
  wpUrl: "https://jupiterdev.areswear.com/",
  designerUrl: "https://imprint.eastus2.cloudapp.azure.com/imprintNextDesigner/",
  storage: "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/",

  // prod - new
  // apiUrl: "https://jupiteradmin.areswear.com/api/",
  // wpUrl: "https://jupiter.areswear.com/",
  // designerUrl: "https://stimprintnext2.eastus2.cloudapp.azure.com/designer/",
  // storage: "https://stjupiterstorage02.blob.core.windows.net/jupiterblob01/"
  
  // stage - new
  // apiUrl: "https://jupiterstaging.azurewebsites.net/api/",
  // wpUrl: "https://jupiterwpstaging.eastus2.cloudapp.azure.com/",
  // designerUrl: "https://imprintnextstaging.eastus2.cloudapp.azure.com/designer/",
  // storage: "https://stjupiterstorage02.blob.core.windows.net/jupiterblob01/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
