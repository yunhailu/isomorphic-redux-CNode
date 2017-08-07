/**
 * Created by a58 yunhailu 2017/8/7.
 */

export const formatResp = data => {
    let code = 0;
    if(!data) code = -1;
    return { code, data };
};
