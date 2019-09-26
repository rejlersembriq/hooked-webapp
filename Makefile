BUCKET=hooked.link

all: build upload

serve:
	npm run serve

build:
	npm run build

upload:
	aws s3 cp dist/ s3://$(BUCKET) --recursive --profile embriq_lab