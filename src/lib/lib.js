import Circle  from 'lib/shapes/Circle';
import Gdx  from 'lib/utils/Gdx';
import * as functions from 'lib/utils/functions';
/**
 * Re-export it all to a namespace-like object hierarchy
 */
window.lib = {

    shapes: {
        Circle: Circle
    },
    utils: {
        Gdx: Gdx,
        functions: functions
    }
}
