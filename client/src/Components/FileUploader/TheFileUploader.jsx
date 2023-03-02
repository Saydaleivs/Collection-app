import { FileUploader } from 'react-drag-drop-files'
import { useTranslation } from 'react-i18next'

const fileTypes = ['JPEG', 'PNG', 'GIF']

export default function TheFileUploader({ collection, setCollection }) {
  const { t } = useTranslation()

  const handleChange = (file) => {
    if (file) {
      getImageUrl(file[0])
    }
  }

  function getImageUrl(file) {
    let reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => setCollection({ ...collection, image: reader.result })
  }

  return (
    <div>
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        name='file'
        types={fileTypes}
      />
      <p>
        {collection.image ? (
          <img
            style={{ width: 300, height: 170, marginTop: 10 }}
            src={collection.image}
            alt=''
          />
        ) : (
          t('no img uploaded yet')
        )}
      </p>
    </div>
  )
}
