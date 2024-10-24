RELEASE_NUM = 2-0
CHANNEL = prod-$(RELEASE_NUM)
DEST = NONE

build-prep:
	@echo "***************************"
	@echo " App Version Number: $(RELEASE_NUM)"
	@echo " Release Channel: $(CHANNEL)"
	@echo "***************************"
	@echo

	@echo "Updating app.json"
	node scripts/updateConfig.js $(RELEASE_NUM) $(DEST)

build-finish:
	@echo "Resetting app.json"
	node scripts/resetConfig.js
	npx prettier --write app.json
	npx prettier --write eas.json

build-ios:
	$(MAKE) build-prep DEST=IOS
	-eas build -p ios --profile production --auto-submit --non-interactive --no-wait
	$(MAKE) build-finish

build-android:
	$(MAKE) build-prep DEST=ANDROID
	-eas build -p android --profile production --auto-submit --non-interactive --no-wait
	$(MAKE) build-finish

build-all:
	$(MAKE) build-prep DEST=ALL
	-eas build -p all --profile production --auto-submit --non-interactive --no-wait
	$(MAKE) build-finish
	
publish: build-prep
	expo publish --release-channel $(CHANNEL)
	$(MAKE) build-finish