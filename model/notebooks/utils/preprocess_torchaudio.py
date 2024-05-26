import random
import math
import numpy as np

import torch
import torch.nn.functional as F
import torchaudio
import torchaudio.functional as audioF
import torchaudio.transforms as audioT
from torchaudio.utils import download_asset

def waveform_to_mel_spectrogram_db(waveform, n_fft=512, hop_length=512, win_length=None, n_mels=15, sample_rate=22050):
    mel_spectrogram = audioT.MelSpectrogram(
        sample_rate=sample_rate,
        n_fft=n_fft,
        win_length=win_length,
        hop_length=hop_length,
        center=True,
        pad_mode="reflect",
        power=2.0,
        norm='slaney',
        n_mels=n_mels,
        mel_scale="htk",
    )

    melspec = mel_spectrogram(waveform)
    return melspec.squeeze()

def audio_to_mel_spectrogram_db(audio_file, n_fft=512, hop_length=512, win_length=None, n_mels=15, sample_rate=22050):
    waveform, _ = torchaudio.load(audio_file)
    melspec = waveform_to_mel_spectrogram_db(waveform, n_fft, hop_length, win_length, n_mels, sample_rate)
    return melspec

def pad(spectrograms, random_pad=True, padding_value=0):
    max_x = 0
    max_y = 0

    for spectrogram in spectrograms:
        if spectrogram.shape[0] > max_x:
            max_x = spectrogram.shape[0]
        if spectrogram.shape[1] > max_y:
            max_y = spectrogram.shape[1]
    
    print (f'padding max_x {max_x}')
    print (f'padding max_y {max_y}')
    
    if random_pad:
        result = []
        for spectrogram in spectrograms:
            min_x = 0
            min_y = 0
            random_x = random.randint(min_x, max_x - spectrogram.shape[0])
            random_y = random.randint(min_y, max_y - spectrogram.shape[1])
           
            padded_spectrogram = F.pad(
                input=spectrogram,
                pad=(random_y, max_y - spectrogram.shape[1] - random_y, random_x, max_x - spectrogram.shape[0] - random_x),
                mode='constant',
                value=padding_value
            )
            result.append(padded_spectrogram)
    else:
        result = [F.pad(input=spectrogram, pad=(0, max_y - spectrogram.shape[1], 0, max_x - spectrogram.shape[0]), mode='constant', value=padding_value) for spectrogram in spectrograms]
    
    del spectrograms
    return result

def normalize_tensor(tensors):
    normalized_tensors = []
    for t in tensors:
        mean, std = torch.mean(t), torch.std(t)
        normalized_tensors.append((t-mean)/std)
    return torch.tensor(np.array(normalized_tensors), dtype=torch.float32)

def normalize_list(spectrograms):
    normalized_tensors = []
    for spectrogram in spectrograms:
        mean, std = torch.mean(spectrogram), torch.std(spectrogram)
        normalized_tensors.append((spectrogram-mean)/std)
    return normalized_tensors

def spectrogram_to_tensor_save(spectrograms, filename):
    spectrograms = [torch.tensor(data, dtype=torch.float32) for data in spectrograms]
    spectrograms = torch.stack(spectrograms)
    torch.save(spectrograms, f'../../data/{filename}.pt')
    
# Data Augment
    
def apply_effect(waveform, sample_rate, effect=None, format='wav', encoder=None):
    effector = torchaudio.io.AudioEffector(effect=effect, format=format, encoder=encoder)
    return effector.apply(waveform.T, sample_rate).T

path_noise_1 = '../../data/noises/noise_FR_1.wav'
path_noise_2 = '../../data/noises/noise_FR_2.wav'
path_noise_3 = '../../data/noises/noise_FR_3.wav'
path_noise_4 = '../../data/noises/noise_FR_4.wav'
def apply_noise(waveform):
    waveform_noise_1, sample_rate = torchaudio.load(path_noise_1)
    waveform_noise_2, sample_rate = torchaudio.load(path_noise_2)
    waveform_noise_3, sample_rate = torchaudio.load(path_noise_3)
    waveform_noise_4, sample_rate = torchaudio.load(path_noise_4)
    
    noise_num = random.randint(1, 4)
    snr_num = random.randint(0, 1)
    
    #découpage des noises sur la même shape que le son a augmenter
    if noise_num == 1:
        noise = waveform_noise_1[:, : waveform.shape[1]] 
    elif noise_num == 2:
        noise = waveform_noise_2[:, : waveform.shape[1]] 
    elif noise_num == 3:
        noise = waveform_noise_3[:, : waveform.shape[1]] 
    elif noise_num == 4:
        noise = waveform_noise_4[:, : waveform.shape[1]] 
        
    if noise.shape[1] < waveform.shape[1]:
        diff = waveform.shape[1] - noise.shape[1]
        noise = torch.concat((noise, noise[:, :diff]), dim=1)
        
    snr_dbs = torch.tensor([20, 10, 3])
    noisy_speeches = audioF.add_noise(waveform, noise, snr_dbs)
    noisy_speech = noisy_speeches[snr_num:snr_num+1]
    return noisy_speech

SAMPLE_RIR = download_asset("tutorial-assets/Lab41-SRI-VOiCES-rm1-impulse-mc01-stu-clo-8000hz.wav")
def apply_reverb(waveform):
    waveform_length = waveform.shape[1]
    waveform_rir, sample_rate = torchaudio.load(SAMPLE_RIR)
    rir = waveform_rir[:, int(sample_rate * 1.01) : int(sample_rate * 1.3)]
    rir = rir / torch.linalg.vector_norm(rir, ord=2)
    
    rir_augment = audioF.fftconvolve(waveform, rir)
    return rir_augment[:,:waveform_length]

def apply_random_speed(waveform, sample_rate):
    min_value = 0.8
    max_value = 1.2
    speed = random.uniform(min_value, max_value)
    effect = f"atempo={speed}"
    return apply_effect(waveform, sample_rate, effect=effect)

def apply_random_codec(waveform, sample_rate):
    codec_num = random.randint(0, 2)
    
    if codec_num == 0:
        result_encode = apply_effect(waveform, sample_rate, encoder='pcm_mulaw') 
    elif codec_num == 1:
        result_encode = apply_effect(waveform, sample_rate, encoder='g722') 
    elif codec_num == 2:
        result_encode = apply_effect(waveform, sample_rate, format='ogg', encoder='vorbis')
    
    return result_encode

def truncate_voice(waveform, target_sample_number):
    
    # padding sur waveform si inférieur à target_sample_number (96000 => 2sec)
    # padding par 0, une fois normalisé le spectrogram n'est pas dégradé
    if waveform.shape[1] < target_sample_number:
        waveform = F.pad(
                input=waveform,
                pad=(int(target_sample_number/2), int(target_sample_number/2), 0,0),
                mode='constant',
                value=0
            )
    
    window_length = target_sample_number/8
    possible_windows_num = math.ceil(waveform.shape[1]/window_length)
    
    highest_mean = 0
    ideal_window_start = 0
    
    abs_waveform = torch.abs(waveform)
    for i in range(0, possible_windows_num):
        win_start = int(i * window_length)
        win_stop = win_start+target_sample_number
        absolute_mean = torch.mean(abs_waveform[:,win_start:win_stop])
        
        if (absolute_mean > highest_mean):
            highest_mean = absolute_mean
            ideal_window_start = win_start
    
    result = waveform[:,ideal_window_start:ideal_window_start+target_sample_number]
    if result.shape[1] < target_sample_number:
        diff = target_sample_number - result.shape[1]
        result = F.pad(
                input=result,
                pad=(int(diff/2), int(diff/2), 0,0),
                mode='constant',
                value=0
            )
    return result 