# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Homepage - Cocinas Integrales**: Corregida uniformidad visual de imágenes
  - Implementado `<figure>` con `aspect-ratio: 16/10` + `overflow: hidden` para proporción consistente
  - Configuradas imágenes con `height: 100%` + `object-fit: cover` sin deformación
  - Cambios aislados con selector `[data-card-id="cocinas-integrales"]`
  - Preservado grid responsive (`1fr` en móvil) sin afectar otras secciones