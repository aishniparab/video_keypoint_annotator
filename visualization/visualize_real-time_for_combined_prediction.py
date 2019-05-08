import cv2 as cv
import pandas as pd
import numpy as np

def gen_vis_eye(img, eye_info, flag, frame_n):
    if flag:
        frame_num, state, inner_x, inner_y, outer_x, outer_y, pupil_x, pupil_y = eye_info
    else:    
        frame_num, state, outer_x, outer_y, inner_x, inner_y, pupil_x, pupil_y = eye_info
    
    p_list = [(outer_x, outer_y), (inner_x, inner_y), (pupil_x, pupil_y)]

    # use approx. position for box
    box_x = (outer_x + inner_x)/2
    box_y = (outer_y + inner_y)/2
    box_w = (inner_x - outer_x)*1.5
    box_h = box_w * .6

    if state >= .5:
        box_color = (255, 255, 255)
    else:
        box_color = (0, 0, 0)
        p_list = p_list[:-1]

    # draw points
    colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
    for i, p in enumerate(p_list):
        if p[0] != -1:
            cv.circle(img, (int(p[0]), int(p[1])), 2, colors[i], thickness=3)

    # draw boxes
    cv.rectangle(img,
                 (int(box_x - box_w / 2), int(box_y - box_h / 2)),
                 (int(box_x + box_w / 2), int(box_y + box_h / 2)),
                 color=box_color, thickness=2)
    # draw frame_num
    font = cv.FONT_HERSHEY_SIMPLEX
    cv.putText(img,"csv frame: {}".format(str(int(frame_num))),(450,100), font, 1,(255,255,255),2,cv.LINE_AA)
    cv.putText(img,"vid frame: {}".format(frame_n),(450,140), font, 1,(255,255,255),2,cv.LINE_AA)
    
    # draw eye state
    cv.putText(img, "state: ", (450, 180), font, 1, (255, 255, 255), 2, cv.LINE_AA)
    if state >= .5:
        cv.putText(img, "open", (550, 180), font, 1, (255, 0, 0), 2, cv.LINE_AA)
    else:
        cv.putText(img, "closed", (550, 180), font, 1, (0, 255, 0), 2, cv.LINE_AA)
    return img


df_aish = pd.read_csv('annotations/2019_05_07_blink_combined_aishni_v1.csv')
df_aish = df_aish.drop('flag', axis=1)
df_li = pd.read_csv('annotations/2019_05_07_blink_combined_li_v1.csv')
df_li = df_li.drop('flag', axis=1)
df_model = pd.read_csv('annotations/blink_v2.csv')
df_model = df_model.drop(['eye_conf', 'box_x', 'box_y', 
        'box_w', 'box_h', 'outer_conf',
        'inner_conf', 'pupil_conf'], axis=1)
out_path = "videos/combined/blink_combined.mp4"

v = cv.VideoCapture('videos/blink_v2.MP4')
_, frame = v.read()
h, w = frame.shape[:2]
fourcc = 1983148141
out_v = cv.VideoWriter(out_path, fourcc, 30, (1440, 480))

i = 0
while True:
    #_, frame = v.read()
    if not _:
        break

    aish_eye_info = df_aish[df_aish['frame_num'] == i]
    li_eye_info = df_li[df_li['frame_num'] == i]
    model_eye_info = df_model[(df_model['frame_num'] == i) & (df_model['if_right_eye'] == True)] 
    model_eye_info = model_eye_info.drop('if_right_eye', axis=1)

    if len(aish_eye_info) == 1:
        aish_eye_info = list(aish_eye_info.iloc[0])
    else:
        print('no detection')
        continue
    if len(li_eye_info) == 1:
        li_eye_info = list(li_eye_info.iloc[0].values)
    else:
        print('no detection')
        continue
    if len(model_eye_info) == 1:
        model_eye_info = list(model_eye_info.iloc[0].values)
    else:
        print('no detection')
        continue
    

    aish_frame = frame.copy()
    li_frame = frame.copy()
    model_frame = frame.copy()

    aish_frame_vis = gen_vis_eye(aish_frame, aish_eye_info, True, str(i))
    li_frame_vis = gen_vis_eye(li_frame, li_eye_info, True, str(i))
    model_frame_vis = gen_vis_eye(model_frame, model_eye_info, False, str(i))

    aish_frame = cv.resize(aish_frame_vis[:1080, 430:1570, :], (480,480))
    li_frame = cv.resize(li_frame_vis[:1080, 430:1570, :], (480, 480))
    model_frame = cv.resize(model_frame_vis[:1080, 430:1570, :], (480, 480))
    
    vis = np.concatenate((aish_frame.astype(np.uint8), li_frame.astype(np.uint8), model_frame.astype(np.uint8)), axis=1)
    #vis = np.concatenate((aish_frame_vis, li_frame_vis, model_frame_vis), axis=1)
    
    cv.imshow('vis', vis)

    if cv.waitKey(1)==27: 
        break
    out_v.write(vis)

    i += 1
    _, frame = v.read()

v.release()
out_v.release()


    