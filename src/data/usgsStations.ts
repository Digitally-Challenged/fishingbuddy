import { ArkansasStream, isArkansasStream } from './arkansasStreams';

export interface USGSStation {
  stationNumber: string;
  stationName: string;
  riverBasin: USGSRiverBasin;
  parameters: {
    gageHeight: boolean;
    discharge: boolean;
  };
}

export type USGSRiverBasin = 
  | 'White River Basin'
  | 'Arkansas River Basin'
  | 'Red River Basin'
  | 'Ouachita-Tensas River Basins'
  | 'St. Francis River Basin'
  | 'Mississippi River Basin';

export const usgsStations: USGSStation[] = [
  // White River Basin
  {
    stationNumber: '07046400',
    stationName: 'Seven-mile Ditch at Big Lake WMA near Manila, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07047980',
    stationName: 'White River at Elkins, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07048493',
    stationName: 'Town Br. at S Morningside at Fayetteville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07048550',
    stationName: 'West Fork White River east of Fayetteville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07048600',
    stationName: 'White River near Fayetteville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07048780',
    stationName: 'Richland Creek near Goshen, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07049000',
    stationName: 'War Eagle Creek near Hindsville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07049698',
    stationName: 'White River near Busch, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07050500',
    stationName: 'Kings River near Berryville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07053207',
    stationName: 'Long Creek at Denver, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07053250',
    stationName: 'Yocum Creek near Oak Grove, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07054410',
    stationName: 'Bear Creek near Omaha, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07055607',
    stationName: 'Crooked Creek at Kelly Crossing at Yellville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07055646',
    stationName: 'Buffalo River near Boxley, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07055660',
    stationName: 'Buffalo River at Ponca, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07055680',
    stationName: 'Buffalo River at Pruitt, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07055780',
    stationName: 'Buffalo River at Carver Access nr Hasty, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07055875',
    stationName: 'Richland Creek near Witts Spring, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07056000',
    stationName: 'Buffalo River near St. Joe, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07056515',
    stationName: 'Bear Creek near Silver Hill, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07056700',
    stationName: 'Buffalo River near Harriet, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07057370',
    stationName: 'White River near Norfork, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07058980',
    stationName: 'Bennetts River at Vidette, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07059450',
    stationName: 'Big Creek near Elizabeth, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07060500',
    stationName: 'White River at Calico Rock, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07060710',
    stationName: 'North Sylamore Creek near Fifty Six, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07060728',
    stationName: 'White River at Allison, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07061000',
    stationName: 'White River at Batesville, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07064000',
    stationName: 'Black River near Corning, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07064026',
    stationName: 'Black River near Peach Orchard, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07064040',
    stationName: 'Little River near Peach Orchard, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07069000',
    stationName: 'Black River at Pocahontas, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07069190',
    stationName: 'Mammoth Spring at Mammoth Spring',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07069220',
    stationName: 'Spring River near Mammoth Spring, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07069295',
    stationName: 'South Fork Spring River at Saddle, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07069305',
    stationName: 'Spring River at Spring Street Bridge at Hardy, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07069500',
    stationName: 'Spring River at Imboden, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07072000',
    stationName: 'Eleven Point River near Ravenden Springs, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07072500',
    stationName: 'Black River at Black Rock, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07074000',
    stationName: 'Strawberry River near Poughkeepsie, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07074420',
    stationName: 'Black River at Elgin Ferry, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07074500',
    stationName: 'White River at Newport, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07074670',
    stationName: 'Tuckerman Ditch at Tuckerman, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07074850',
    stationName: 'White River near Augusta, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07074886',
    stationName: 'Cutoff Creek near Rio Vista, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07074888',
    stationName: 'Glaise Creek near Rio Vista, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07075000',
    stationName: 'Middle Fork of Little Red River at Shirley, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07075270',
    stationName: 'South Fork of Little Red River near Scotland, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07075300',
    stationName: 'South Fork of Little Red River at Clinton, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07076517',
    stationName: 'Little Red River near Dewey, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07076634',
    stationName: 'Little Red River at Judsonia, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07076750',
    stationName: 'White River at Georgetown, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077000',
    stationName: 'White River at DeValls Bluff, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077380',
    stationName: 'Cache River at Egypt, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077500',
    stationName: 'Cache River at Patterson, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077555',
    stationName: 'Cache River near Cotton Plant, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077700',
    stationName: 'Bayou DeView near Morton, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07077730',
    stationName: 'Bayou Deview near Brinkley, AR',
    riverBasin: 'White River Basin',
    parameters: { gageHeight: true, discharge: false }
},
  // Red River Basin Stations
{
    stationNumber: '07337000',
    stationName: 'Red River at Index, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07339500',
    stationName: 'Rolling Fork near DeQueen, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07340000',
    stationName: 'Little River near Horatio, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07340300',
    stationName: 'Cossatot River near Vandervoort, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07340500',
    stationName: 'Cossatot River near DeQueen, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07341000',
    stationName: 'Saline River near Dierks, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07341200',
    stationName: 'Saline River near Lockesburg, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07341500',
    stationName: 'Red River at Fulton, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07355860',
    stationName: 'Board Camp Cr nr Wolf Pen Gap Rec nr Nunley, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07355870',
    stationName: 'Gap Cr nr Wolf Pen Gap Rec Area nr Nunley, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07356000',
    stationName: 'Ouachita River near Mount Ida, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07358250',
    stationName: 'Whittington Cr at Whitt. Pk at Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07358253',
    stationName: 'Whittington Cr at Tunnel Ent at Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07358257',
    stationName: 'Hot Sprngs Cr US of T.E. at Glade St at Hot Sp.,AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07358284',
    stationName: 'Hot Springs Cr DS of Grand Ave at Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07358500',
    stationName: 'Lake Hamilton at Carpenter Dam nr. Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07358550',
    stationName: 'Gulpha Creek at Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: false, discharge: false }
},
{
    stationNumber: '07358570',
    stationName: 'Gulpha Cr at Ridgeway St at Hot Springs, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07359000',
    stationName: 'Lake Catherine at Jones Mill, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: false }
},
{
    stationNumber: '07344370',
    stationName: 'Red River at Spring Bank, AR',
    riverBasin: 'Red River Basin',
    parameters: { gageHeight: true, discharge: true }
},

  // Arkansas River Basin Stations
{
    stationNumber: '07191160',
    stationName: 'Spavinaw Creek near Maysville, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07191179',
    stationName: 'Spavinaw Creek near Cherokee City, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07194800',
    stationName: 'Illinois River at Savoy, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '071948095',
    stationName: 'Mud Creek near Johnson, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07194880',
    stationName: 'Osage Creek near Cave Springs, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07194906',
    stationName: 'Spring Creek at Sanders Ave at Springdale, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07194933',
    stationName: 'Spring Creek at Hwy 112 nr Springdale, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07195000',
    stationName: 'Osage Creek near Elm Springs, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07195400',
    stationName: 'Illinois River at Hwy. 16 near Siloam Springs AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07195430',
    stationName: 'Illinois River South of Siloam Springs, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07195800',
    stationName: 'Flint Creek at Springtown, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07195855',
    stationName: 'Flint Creek near West Siloam Springs, OK',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07196900',
    stationName: 'Baron Fork at Dutch Mills, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07247000',
    stationName: 'Poteau River at Cauthron, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07249400',
    stationName: 'James Fork near Hackett, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07249455',
    stationName: 'Arkansas River at Ft. Smith, AR',
    riverBasin: 'Arkansas River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07249800',
   stationName: 'Lee Creek at Short, OK',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07249920', 
   stationName: 'Little Lee Creek near Nicut, OK',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07249985',
   stationName: 'Lee Creek near Short, OK',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250085',
   stationName: 'Lee Creek at Lee Creek Reservoir near Van Buren,AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250500',
   stationName: 'AR River at Van Buren, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250550',
   stationName: 'AR River at James W. Trimble L&D nr Van Buren, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250935',
   stationName: 'Jones Creek at Winfrey, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250965',
   stationName: 'Frog Bayou at Winfrey, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07250974',
   stationName: 'Jack Creek near Winfrey, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: false, discharge: true }
},
{
   stationNumber: '07251500',
   stationName: 'Frog Bayou at Rudy, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07252000',
   stationName: 'Mulberry River near Mulberry, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07256500',
   stationName: 'Spadra Creek at Clarksville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07257006',
   stationName: 'Big Piney Creek at Highway 164 near Dover, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07257200',
   stationName: 'Little Piney Creek near Lamar, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07257500',
   stationName: 'Illinois Bayou near Scottsville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07258000',
   stationName: 'Arkansas River at Dardanelle, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07258500',
   stationName: 'Petit Jean River near Booneville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07259950',
   stationName: 'Dutch Creek Near Waltreak, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07260500',
   stationName: 'Petit Jean River at Danville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07260640',
   stationName: 'Petit Jean River near Centerville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07260673',
   stationName: 'West Fork Point Remove Creek near Hattieville, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07260800',
   stationName: 'Arkansas River near Morrilton, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07261000',
   stationName: 'Cadron Creek near Guy, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07261090',
   stationName: 'Cypress Creek nr Birdtown, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07261500',
   stationName: 'Fourche LaFave River Near Gravelly, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263000',
   stationName: 'South Fourche LaFave River near Hollis, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263012',
   stationName: 'Fourche LaFave River near Aplin, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263115',
   stationName: 'Fourche La Fave River near Houston, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263265',
   stationName: 'Lake Conway near Mayflower, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263295',
   stationName: 'Maumelle River at Williams Junction, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '072632958',
   stationName: 'Maumelle River West of Wye, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263296',
   stationName: 'Maumelle River near Wye, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '072632962',
   stationName: 'Bringle Creek at Martindale, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '072632963',
   stationName: 'Maumelle River below Bringle Creek nr Wye, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: false, discharge: true }
},
{
   stationNumber: '072632966',
   stationName: 'Lake Maumelle at State Hwy 10 near Wye, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '072632968',
   stationName: 'Lk Maumelle at Mouth of Pigeon Roost Cr nr Wye, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '072632971',
   stationName: 'Yount Creek near Martindale, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '072632982',
   stationName: 'Reece Creek at Little Italy, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263300',
   stationName: 'Maumelle River at Maumelle Dam at Natural Steps,AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263450',
   stationName: 'Arkansas River at Murray Dam near Little Rock, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263500',
   stationName: 'Arkansas River at Little Rock, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263555',
   stationName: 'Fourche Creek at Univ. Avenue at Little Rock, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263580',
   stationName: 'Rock Creek at 36th Street at Little Rock, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263605',
   stationName: 'Fourche Creek at Lindsey St. E of Little Rock, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263650',
   stationName: 'Arkansas River at Pine Bluff, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263708',
   stationName: 'Mound Lake at Plum Bayou Mounds State Park, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07263875',
   stationName: 'WABBASEKA BAYOU AT WABBASEKA, ARK.',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07263878',
   stationName: 'Salt Bayou Ditch nr Humphrey, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07264000',
   stationName: 'Bayou Meto near Lonoke, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07264200',
   stationName: 'BAYOU TWO PRAIRIE AT CARLISLE, ARK.',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07264500',
   stationName: 'BAYOU METO NR STUTTGART, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07265000',
   stationName: 'CROOKED CREEK NEAR HUMPHREY, ARK.',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
{
   stationNumber: '07265280',
   stationName: 'Arkansas River at Pendleton, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: false }
},
{
   stationNumber: '07344370',
   stationName: 'Red River at Spring Bank, AR',
   riverBasin: 'Arkansas River Basin',
   parameters: { gageHeight: true, discharge: true }
},
// St. Francis River Basin Stations
{
    stationNumber: '07047932',
    stationName: 'L\'ANGUILLE R NR WHITEHALL, AR',
    riverBasin: 'St. Francis River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '070479376',
    stationName: 'Brushy Creek Near Vanndale, AR',
    riverBasin: 'St. Francis River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07047942',
    stationName: 'LAnguille River near Colt, AR',
    riverBasin: 'St. Francis River Basin',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07047950',
    stationName: 'LAnguille River at Palestine, AR',
    riverBasin: 'St. Francis River Basin',
    parameters: { gageHeight: true, discharge: true }
},

// Ouachita-Tensas River Basins Stations
{
    stationNumber: '07358280',
    stationName: 'Hot Springs at Hot Springs, AR',
    riverBasin: 'Ouachita-Tensas River Basins',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07364078',
    stationName: 'Ouachita River at Felsenthal L&D (lower)',
    riverBasin: 'Ouachita-Tensas River Basins',
    parameters: { gageHeight: true, discharge: true }
},
{
    stationNumber: '07367680',
    stationName: 'Boeuf River nr Eudora, AR',
    riverBasin: 'Ouachita-Tensas River Basins',
    parameters: { gageHeight: true, discharge: true }
},

// Mississippi River Basin Station
{
    stationNumber: '07032000',
    stationName: 'MISSISSIPPI RIVER AT MEMPHIS, TN',
    riverBasin: 'Mississippi River Basin',
    parameters: { gageHeight: true, discharge: true }
}
]; // Close the array here

// Utility function to get stations by river basin
export function getStationsByBasin(basin: USGSRiverBasin): USGSStation[] {
  return usgsStations.filter(station => station.riverBasin === basin);
}

// Enhanced version of getStationsByStream that validates against known Arkansas streams
export function getStationsByStream(streamName: string): USGSStation[] {
  if (isArkansasStream(streamName)) {
    return getStationsAlongStream(streamName);
  }
  
  // Fallback to existing behavior for non-Arkansas streams
  return usgsStations.filter(station => 
    station.stationName.toLowerCase().includes(streamName.toLowerCase())
  );
}

// Utility function to get station by number
export function getStationByNumber(stationNumber: string): USGSStation | undefined {
  return usgsStations.find(station => station.stationNumber === stationNumber);
}

// Utility function to format station display name
export function formatStationDisplay(station: USGSStation): string {
  return `${station.stationName} (${station.stationNumber})`;
}

// Get all stations along a specific Arkansas stream
export function getStationsAlongStream(stream: ArkansasStream): USGSStation[] {
  return usgsStations.filter(station => {
    // Handle special cases
    if (stream === 'Buffalo National River' && 
        station.stationName.toLowerCase().includes('buffalo river')) {
      return true;
    }
    
    return station.stationName.toLowerCase().includes(stream.toLowerCase());
  });
}

// Get all stations with both gage height and discharge
export function getStationsWithFullData(): USGSStation[] {
  return usgsStations.filter(station => 
    station.parameters.gageHeight && station.parameters.discharge
  );
}

// Get primary stations along a stream
// (stations that measure both gage height and discharge)
export function getPrimaryStationsAlongStream(stream: ArkansasStream): USGSStation[] {
  return getStationsAlongStream(stream).filter(station =>
    station.parameters.gageHeight && station.parameters.discharge
  );
}