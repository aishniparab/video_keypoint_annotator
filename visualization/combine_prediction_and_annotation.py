import pandas as pd
import numpy as np


def combine(url_pred, url_anno, url_out):
    df_pred = pd.read_csv(url_pred)
    df_pred = df_pred[df_pred['if_right_eye'] == True]
    df_pred = df_pred.drop_duplicates('frame_num')
    df_pred = df_pred.drop(['eye_conf', 'box_x', 'box_y',	'box_w', 'box_h',
                            'outer_conf', 'inner_conf',	'pupil_conf', 'if_right_eye'], axis=1)
    df_pred = df_pred.set_index('frame_num')

    df_anno = pd.read_csv(url_anno)
    df_anno = df_anno.set_index('frame_num')

    df_join = df_anno.combine_first(df_pred)

    df_join_check = df_join.drop('flag', axis=1)
    # no na values
    assert df_join_check.isnull().values.any() == False
    # all frames have annotation
    assert len(df_join_check)-1 == np.max(np.array(df_join_check.index))

    df_join.to_csv(url_out)


if __name__ == '__main__':

    url_pred = 'scan_room_v2.csv'
    url_anno = '2019_05_07_scan_room_v2_annotations_aishni_v1.csv'
    url_out = '2019_05_07_scan_room_combined_v1.csv'

    combine(url_pred, url_anno, url_out)
