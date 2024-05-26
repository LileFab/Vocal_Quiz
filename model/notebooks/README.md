# Voice Quiz - Notebooks
This folder contains every notebooks we used to visualize datas, to preprocess datas, to train models and also a CSV reporting file of our model training.

## Notebooks description
Jupyter notebooks are segmented cell files that can use python program, and can be run cell by cell.


## Installation
In order to run those notebooks, some depedencies need to be install. All these depedencies are listed in `requirements_xxx.txt` files.

The `data_augment_V2.ipynb` notebook is needing specific installation because it is using [torchaudio](https://pytorch.org/audio/stable/index.html) with [FFMPEG](https://ffmpeg.org/). Installation must be done using anaconda for FFMPEG to be correctly installed.

### With pip
Python virtual environment creation
```bash
 python -m venv .venv
```

Python virtual environment activation
```bash
./.venv/Scripts/activate
```

Depedencies installation on venv using pip
```bash
pip install -r requirements_dev.txt
```

### With conda
Conda virtual environment with depedencies installation
```bash
conda create --name .venv --file requirements_dev_conda.txt
```

Conda virtual environment activation
```bash
conda activate
```

## Usage
Each file can be runned separatly and have its own purpose.

- `analysis_audio.ipynb` Different spectrogram analysis possible on audio files.
- `format_performance.ipynb` Performance difference between wav and mp3 file process calculation.
- `preprocess_dataset.ipynb` First pre processing step on dataset (mp3 to wav)
- `model_cnn.ipynb` Experiment on Convolutionnal Neural Network (CNN) to extract speech from audios.
- `dataset_augment.ipynb` Data augmentation experiment and process on dataset to improve model accuracy with more data.
- `model_lstm.ipynb` Training on LSTM model to extract speech from audios. Using pre processed tensor generated from `dataset_augment.ipynb`. And also reporting model result with hyper parameters in `result.csv`.
- `lstm_distillation` Distillation of teacher model to student one, for model size optimization

## Appendices 
### Utils
Containing some utils fonctions for graph plotting and audio processing.
