from pydub import AudioSegment


def get_audio_info(file_path):
    audio = AudioSegment.from_file(file_path)
    info = {
        'channels': audio.channels,
        'sample_width': audio.sample_width,
        'frame_rate': audio.frame_rate,
        'frame_count': len(audio.get_array_of_samples())
    }
    return info


def compare_audio_files(file1, file2):
    info1 = get_audio_info(file1)
    info2 = get_audio_info(file2)
    comparison = {
        'channels': (info1['channels'], info2['channels']),
        'sample_width': (info1['sample_width'], info2['sample_width']),
        'frame_rate': (info1['frame_rate'], info2['frame_rate']),
        'frame_count': (info1['frame_count'], info2['frame_count'])
    }
    return comparison


def print_comparison(comparison):
    for key, value in comparison.items():
        print(f"{key}: File1 = {value[0]}, File2 = {value[1]}")


file1 = 'file1.wav'
file2 = 'file2.wav'

comparison = compare_audio_files(file1, file2)
print_comparison(comparison)
