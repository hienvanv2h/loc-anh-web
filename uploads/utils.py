import numpy as np
from PIL import Image
import cv2

# Ideal filters
def ideal_lp(D0, M, N):
  H = np.zeros((M, N), dtype=np.float32)
  center_row, center_col = int(M / 2), int(N / 2)
  u = np.arange(M)
  v = np.arange(N)
  U, V = np.meshgrid(u, v, indexing='ij')
  D2 = (U - center_row)**2 + (V - center_col)**2   #D^2
  H = np.where(D2 <= float(D0)**2, 1, 0)
  return H

def ideal_hp(D0, M, N):
  return 1 - ideal_lp(D0, M, N)

# Gaussian filters
def gaussian_lp(D0, M, N):
  H = np.zeros((M, N), dtype=np.float32)
  center_row, center_col = int(M / 2), int(N / 2)
  u = np.arange(M)
  v = np.arange(N)
  U, V = np.meshgrid(u, v, indexing='ij')
  D2 = (U - center_row)**2 + (V - center_col)**2  #D^2
  D02 = float(D0)**2
  H = np.exp(-D2/(2*D02))

  return H

def gaussian_hp(D0, M, N):
  return 1 - gaussian_lp(D0, M, N)

# Butterworth filters
def butterworth_lp(D0, M, N, n=2):
  H = np.zeros((M, N), dtype=np.float32)
  center_row, center_col = int(M / 2), int(N / 2)
  u = np.arange(M)
  v = np.arange(N)
  U, V = np.meshgrid(u, v, indexing='ij')
  D2 = (U - center_row)**2 + (V - center_col)**2  #D^2
  D02 = float(D0)**2
  H = 1 / (1 + (D2/D02)**n)

  return H

def butterworth_hp(D0, M, N, n=2):
  return 1 - butterworth_lp(D0, M, N, n)

# Processing function
def get_filtered_image(image: Image.Image, action, cutoff_val):

  f = np.asarray(image)
  shape = np.shape(f)
  M, N = shape
  # Zero-padding
  P, Q = 2*M, 2*N
  f_zp = np.zeros((P, Q))
  f_zp[:shape[0],:shape[1]] = f
  # Perform the Discrete Fourier Transform (DFT)
  F = np.fft.fft2(f_zp)
  # Shift the zero-frequency component to the center
  F_shift = np.fft.fftshift(F)
  # Create filter depend on action choices
  if action == "IDEAL_LP":
    H = ideal_lp(cutoff_val, P, Q)
  elif action == "GAUSSIAN_LP":
    H = gaussian_lp(cutoff_val, P, Q)
  elif action == "BUTTERWORTH_LP":
    H = butterworth_lp(cutoff_val, P, Q)
  elif action == "IDEAL_HP":
    H = ideal_hp(cutoff_val, P, Q)
  elif action == "GAUSSIAN_HP":
    H = gaussian_hp(cutoff_val, P, Q)
  elif action == "BUTTERWORTH_HP":
    H = butterworth_hp(cutoff_val, P, Q)
  else:
    return image

  G = F_shift * H
  # Inverse DFT
  G_shift = np.fft.ifftshift(G)
  G_shift = np.asarray(G_shift, dtype=np.float32)
  g_zp = np.fft.ifft2(G_shift)
  # Post-processing
  g = g_zp[:shape[0],:shape[1]]
  g = np.abs(g)  # Take the absolute value to ensure non-negative pixel values
  g = (g / np.max(g) * 255).astype(np.uint8)
  # Convert back to PIL Image
  filtered = Image.fromarray(g)
  return filtered

# FILTER_CHOICES = (
#   ("NO_FILTER", "No filter"),
#   ("IDEAL_LP", "Ideal Low Pass"),
#   ("GAUSSIAN_LP", "Gaussian Low Pass"),
#   ("BUTTERWORTH_LP", "Butterworth Low Pass"),
#   ("IDEAL_HP", "Ideal High Pass"),
#   ("GAUSSIAN_HP", "Gaussian High Pass"),
#   ("BUTTERWORTH_HP", "Butterworth High Pass"),
# )