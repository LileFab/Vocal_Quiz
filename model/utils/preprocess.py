import numpy as np
import torch
import math
import torch.nn.functional as F
import torchaudio
import torchaudio.transforms as audioT


def waveform_to_mel_spectrogram_db(waveform, n_fft=512, hop_length=512,
                                   win_length=None, n_mels=15,
                                   sample_rate=22050):
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


def audio_to_mel_spectrogram_db(audio_file, n_fft=512, hop_length=512,
                                win_length=None, n_mels=15, sample_rate=22050):
    waveform, _ = torchaudio.load(audio_file)
    melspec = waveform_to_mel_spectrogram_db(waveform, n_fft, hop_length,
                                             win_length, n_mels, sample_rate)
    return melspec


def normalize(tensor):
    mean, std = torch.mean(tensor), torch.std(tensor)
    return torch.tensor((tensor-mean)/std, dtype=torch.float32)


def truncate_voice(waveform, target_sample_number):
    if waveform.shape[1] < target_sample_number:
        waveform = F.pad(
                input=waveform,
                pad=(int(target_sample_number/2), int(target_sample_number/2),
                     0, 0),
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
        absolute_mean = torch.mean(abs_waveform[:, win_start:win_stop])
        if (absolute_mean > highest_mean):
            highest_mean = absolute_mean
            ideal_window_start = win_start
    result = waveform[:,
                      ideal_window_start:
                          ideal_window_start+target_sample_number
                      ]
    if result.shape[1] < target_sample_number:
        diff = target_sample_number - result.shape[1]
        result = F.pad(
                input=result,
                pad=(int(diff/2), int(diff/2),
                     0, 0),
                mode='constant',
                value=0
            )
    return result


def spectrogram_to_tensor_save(spectrogram, filename):
    spectrogram = [torch.tensor(data,
                                dtype=torch.float32) for data in spectrogram]
    spectrogram = pad(spectrogram)
    spectrogram = torch.stack(spectrogram)
    torch.save(spectrogram, filename)
