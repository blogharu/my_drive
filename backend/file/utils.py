from pathlib import Path


def get_files(dir_path: Path) -> list[dict]:
    files = []
    for file in dir_path.glob("*"):
        if file.is_dir():
            file_type = "d"
        elif file.is_file():
            file_type = "-"
        else:
            continue
        stat = file.stat()
        files.append(
            dict(
                name=file.name,
                size=stat.st_size,
                type=file_type,
            )
        )
    return files
