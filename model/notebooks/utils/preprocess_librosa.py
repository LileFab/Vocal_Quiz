import librosa
import numpy as np

import torch
import torch.nn.functional as F

def audio_to_power_spectrogram(audio_file, sample_rate=22050, n_fft=2048, hop_length=512):
    y, sr = librosa.load(audio_file, sr=sample_rate)
    spectrogram = np.abs(librosa.stft(y, n_fft=n_fft, hop_length=hop_length)) ** 2
    return spectrogram, y

def audio_to_mel_spectrogram_db(audio_file, sample_rate=22050, n_fft=2048, hop_length=512):
    spectrogram, y = audio_to_power_spectrogram(audio_file, sample_rate, n_fft, hop_length)
    mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sample_rate, S=spectrogram, n_fft=n_fft, hop_length=hop_length, win_length=n_fft)
    mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max) 
    return mel_spectrogram_db

def pad(spectrograms):
    max_x = 0
    max_y = 0

    for spectrogram in spectrograms:
        if spectrogram.shape[0] > max_x:
            max_x = spectrogram.shape[0]
        if spectrogram.shape[1] > max_y:
            max_y = spectrogram.shape[1]
    
    result = [F.pad(input=spectrogram, pad=(0, max_y - spectrogram.shape[1], 0, max_x - spectrogram.shape[0]), mode='constant', value=0) for spectrogram in spectrograms]
    
    del spectrograms
    return result

def spectrogram_to_tensor_save(spectrogram, target, filename):
    spectrogram = [torch.tensor(data, dtype=torch.float32) for data in spectrogram]
    spectrogram = pad(spectrogram)
    spectrogram = torch.stack(spectrogram)
    torch.save(spectrogram, f'../../data/{filename}.pt')
    torch.save(target, f'../../data/target_{filename}.pt')
    
